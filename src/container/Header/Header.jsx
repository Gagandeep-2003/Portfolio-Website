import { useRef } from "react";
import { motion } from "framer-motion";
import { images } from "../../constants";

import { hackerEffect } from "../../constants";
import HeroCenter from "../../components/HeroCenter";
import "./Header.css";

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const Header = ({ id = 'home' }) => {
  const name = useRef();
  const heading = useRef();

  return (
    <div className="app__header" id={id}>
      <header className="app__flex">
        <HeroCenter />
        <motion.div
          className="app__header-info"
          whileInView={{ x: [-100, 0], opacity: [0, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className="badge-cmp app-flex"
            onMouseEnter={() => {
              hackerEffect({ target: name.current });
            }}
          >
            <span>👋</span>
            <div style={{ marginLeft: 20 }}>
              <p className="p-text" ref={heading}>
                Hello, I'am
              </p>
              <h1 className="head-text" ref={name} data-text="Gagan">
                Gagan
              </h1>
            </div>
          </div>

          <div className="tag-cmp app-flex">
            <p className="p-text">Designer / UI-UX</p>
            <p className="p-text">Web Developer</p>
            <p className="p-text">MERN Developer</p>
          </div>
        </motion.div>
        <motion.div
          variant={scaleVariants}
          whileInView={scaleVariants.whileInView}
          className="app__header-circles"
        >
          {[images.figma, images.react, images.cssLogo].map((circle, index) => (
            <div className="circle-cmp app__flex" key={`circle-${index}`}>
              <img src={circle} alt="circle" />
            </div>
          ))}
        </motion.div>
      </header>
    </div>
  );
};

export default Header;
