import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view movies.');
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('/movies', { headers: { Authorization: `Bearer ${token}` } });
        setMovies(res.data);
      } catch (err) {
        setError('Error fetching movies.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [navigate, logout]);

  return { movies, error, loading };
}