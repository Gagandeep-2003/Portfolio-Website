import { motion } from "framer-motion";

const HeroCenter = () => {
  return (
    <>
      <motion.div className="creative">
        <h1>
          <div className="overflowHider">CREATIVE</div>

          <div className="overflowHider">DEVELOPER</div>
        </h1>

        <h2>
          <div className="overflowHider">CREATIVE</div>

          <div className="overflowHider">DEVELOPER</div>
        </h2>

        <h3>
          <div className="overflowHider">CREATIVE</div>

          <div className="overflowHider">DEVELOPER</div>
        </h3>
        <img
          src="https://res.cloudinary.com/jasuaje/image/upload/v1715387111/0bf6e60dfc83a40fd27549c98ac8a55f.png"
          alt=""
        />
      </motion.div>
    </>
  );
};

export default HeroCenter;
