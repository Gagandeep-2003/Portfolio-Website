// MouseFollowerEffect.jsx

import React, { useEffect } from 'react';
import gsap from 'gsap'; // Import GSAP library
import './MouseFollowerEffect.css'; // Import CSS for styling

const MouseFollowerEffect = () => {
  useEffect(() => {
    const followers = document.querySelectorAll('.follower');

    const createRipple = (e) => {
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      document.body.appendChild(ripple);

      const size = Math.max(window.innerWidth, window.innerHeight);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - size / 2}px`;
      ripple.style.top = `${e.clientY - size / 2}px`;

      ripple.addEventListener('animationend', () => {
        ripple.remove(); // Remove the ripple after the animation ends
      });
    };

    document.addEventListener('mousemove', function(e) {
      followers.forEach((follower, index) => {
        const isHovering = document.elementFromPoint(e.clientX, e.clientY);
        const isTextOrImage = isHovering && (isHovering.tagName === 'IMG' || isHovering.nodeType === Node.TEXT_NODE);

        gsap.to(follower, {
          x: e.clientX,
          y: e.clientY,
          delay: index * 0.1,
          opacity: isTextOrImage ? 0.5 : 1, // Make it transparent when hovering over text or image
          scale: isTextOrImage ? 1.5 : 1, // Scale up when hovering over text or image
          duration: 0.3,
          ease: 'power3.out',
          onComplete: () => {
            gsap.to(follower, {
              scale: 1,
              duration: 0.3,
              ease: 'power3.inOut',
              onComplete: () => {
                follower.style.opacity = 0; // Hide the follower after scaling down
              },
            });
          },
        });
      });
    });

    document.addEventListener('click', createRipple); // Add click event listener

    return () => {
      // Clean up event listeners if necessary
      document.removeEventListener('mousemove', function() {});
      document.removeEventListener('click', createRipple); // Clean up click event listener
    };
  }, []);

  return (
    <div className="container">
      {/* Five follower elements initially hidden */}
      <div className="follower" id="follower1"></div>
      <div className="follower" id="follower2"></div>
    </div>
  );
};

export default MouseFollowerEffect;
