import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillGithub } from "react-icons/ai";
import { motion } from "framer-motion";
import { images } from "../../constants";
import { data } from "../../data/work-data";
import Tilt from 'react-tilty';
import { gsap } from "gsap";

import "./Work.css";
import Reveal from "../Reveal/Reveal";

const Work = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [animateCard, setAnimateCard] = useState({ y: 0, opacity: 1 });
  const [filterWork, setFilterWork] = useState([]);
  const [works, setWorks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setWorks(data);
    setFilterWork(data);

    const handleTouchStart = () => {
      setIsTouchScreen(true);
      // Remove the event listener after detecting touch
      window.removeEventListener("touchstart", handleTouchStart);
    };

    // Add the event listener
    window.addEventListener("touchstart", handleTouchStart);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const handleWorkFilter = (item) => {
    setActiveFilter(item);
    setAnimateCard([{ y: 100, opacity: 0 }]);

    setTimeout(() => {
      setAnimateCard([{ y: 0, opacity: 1 }]);
      setVisibleCount(6); // Reset visible count when filter changes
      setFilterWork(works.filter((work) => work.tags.includes(item)));
    }, 500);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
    // Fireworks animation using GSAP
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const burst = () => {
      const particles = [];
      const colors = ["#ff4e50", "#fc913a", "#f9d423", "#eaeaea", "#1abc9c"];

      for (let i = 0; i < 100; i++) {
        const size = Math.random() * 10 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        const destinationX = centerX + (Math.random() - 0.5) * 4 * window.innerWidth;
        const destinationY = centerY + (Math.random() - 0.5) * 4 * window.innerHeight;

        gsap.to(particle, {
          x: destinationX,
          y: destinationY,
          opacity: 0,
          duration: 3,
          ease: "power3.out",
          onComplete: () => {
            particle.remove();
          }
        });

        document.body.appendChild(particle);
      }
    };

    burst();
  };

  return (
    <section className="app__work" id="work">
      <h2 className="head-text hacker-effect">
        My creative <span>Portfolio</span> section
      </h2>

      <div className="app__work-filter">
        {["All", "Best", "Dynamic", "Static"].map((item, index) => (
          <div
            key={index}
            onClick={() => handleWorkFilter(item)}
            className={`app__work-filter-item app__flex p-text ${
              activeFilter === item ? "item-active" : ""
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <motion.div
        animate={animateCard}
        transition={{ duration: 0.5, delayChildren: 0.5 }}
        className={`app__work-portfolio ${isTouchScreen ? "onMobile" : ""}`}
      >
        {filterWork.slice(0, visibleCount).map((work, index) => (
          <Tilt key={index}>
            <div className="app__work-item app__flex">
              <div className="app__work-img">
                <img src={images[work.imgname]} alt={work.name} />

                <motion.div
                  whileHover={!isTouchScreen ? { opacity: [0, 1] } : { opacity: [1, 1] }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                    staggerChildren: 0.5,
                  }}
                  className="app__work-hover app__flex"
                >
                  <a href={work.projectLink} target="_blank" rel="noreferrer">
                    <motion.div
                      whileHover={{ scale: [1, 0.8] }}
                      transition={{
                        duration: 0.25,
                      }}
                      className=" app__flex"
                    >
                      <AiFillEye fill="var(--white-color)" />
                    </motion.div>
                  </a>
                  <a href={work.codeLink} target="_blank" rel="noreferrer">
                    <motion.div
                      whileHover={{ scale: [1, 0.8] }}
                      transition={{
                        duration: 0.25,
                      }}
                      className=" app__flex"
                    >
                      <AiFillGithub fill="var(--white-color)" />
                    </motion.div>
                  </a>
                </motion.div>
              </div>

              <div className="app__work-content app__flex">
                <Reveal>
                  <h4 className="bold-text">{work.title}</h4>
                </Reveal>
                <Reveal>
                  <p className="p-text" style={{ marginTop: 10 }}>
                    {work.description}
                  </p>
                </Reveal>

                <div
                  className={`app__work-tag app__flex ${
                    work.tags?.[1] === "Best" ? "highlight" : ""
                  }`}
                >
                  <p className="p-text">{work.tags.length > 1 ? work.tags[1] : work.tags[0]}</p>
                </div>
              </div>
            </div>
          </Tilt>
        ))}
      </motion.div>

      {visibleCount < filterWork.length && (
        <button className="btn" onClick={handleLoadMore}>
          <span className="btn-text-one">Load More</span>
          <span className="btn-text-two">Let's Go🚀</span>
        </button>
      )}
    </section>
  );
};

export default Work;
