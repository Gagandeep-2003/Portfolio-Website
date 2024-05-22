import "./App.css";

import { Header, About, Work, Skills, Footer } from "./container";
import { Navbar } from "./components";
import { ReactLenis } from "@studio-freight/react-lenis";

const App = () => {
  return (
    // ReactLenis is used for smooth scrolling
    <ReactLenis root options={{ lerp: 0.1, duration: 1, smoothTouch: true }}> 
      <div className="app">
        <Navbar />
        <Header />
        <About />
        <Work />
        <Skills />
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default App;
