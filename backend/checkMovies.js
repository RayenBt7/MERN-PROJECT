import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';

dotenv.config();

const checkMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-project');
    const movies = await Movie.find({});
    console.log('Movies in database:', movies);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkMovies();
