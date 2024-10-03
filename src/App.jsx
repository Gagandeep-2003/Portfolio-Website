import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Header, About, Work, Skills, Footer } from './container';
import { Navbar } from './components';
import LoadingPage from './container/LoadingPage/LoadingPage';
import MouseFollowerEffect from './components/MouseFollowerEffect/MouseFollowerEffect'; 
import './App.css';

const App = () => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1, smoothTouch: true }}>
      <div className="app">
        <MouseFollowerEffect /> 
        <Navbar />
        <Header />
        <About />
        <Work />
        <Skills />
        <Footer />
        <LoadingPage />
      </div>
    </ReactLenis>
  );
};

export default App;
