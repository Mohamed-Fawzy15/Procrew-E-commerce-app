import React from "react";
import { Link } from "react-router-dom";
import style from "./notfound.module.css";

export default function NotFound() {
  return (
    <div className={style.notFoundContainer}>
      <div className={style.notFoundContent}>
        <h1 className={style.errorCode}>404</h1>
        <h2 className={style.errorTitle}>Page Not Found</h2>
        <p className={style.errorMessage}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={style.homeButton}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
