import React, { useEffect } from 'react';
import gsap from 'gsap';
import "./LoadingPage.css";

const LoadingPage = () => {
  useEffect(() => {
    function loadingAnimation() {
      gsap.fromTo(
        "#nav",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          delay: 4,
        }
      );

      gsap.fromTo(
        ".loading-page",
        { opacity: 1 },
        {
          opacity: 0,
          display: "none",
          duration: 1.5,
          delay: 3.7,
        }
      );

      gsap.fromTo(
        ".logo-name",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 2,
          delay: 0.5,
        }
      );
    }

    loadingAnimation();
  }, []);

  return (
    <div className="loading-page">
      <svg id="svg" width="210px" height="210px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
      </svg>
      <div className="name-container">
        <div className="logo-name">Gagan</div>
      </div>
    </div>
  );
}

export default LoadingPage;
