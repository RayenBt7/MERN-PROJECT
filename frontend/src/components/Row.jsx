import React from "react";
import "../styles/movies.css";

export default function Row({ children, className = "" }) {
  return (
    <div className={`row ${className}`}>
      {children}
    </div>
  );
}
