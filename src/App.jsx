import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Header, About, Work, Skills, Footer } from './container';
import { Navbar } from './components';
import LoadingPage from './container/LoadingPage/LoadingPage';
import MouseFollowerEffect from './components/MouseFollowerEffect/MouseFollowerEffect';
import TabSwitcher from './components/TabSwitcher/TabSwitcher';
import './App.css';

const sections = [
  {
    id: 'header',
    title: 'Home',
    description: 'Welcome to my portfolio! I am a passionate developer creating innovative solutions.'
  },
  {
    id: 'about',
    title: 'About',
    description: 'Learn more about my journey, skills, and what drives me in the world of technology.'
  },
  {
    id: 'work',
    title: 'Work',
    description: 'Explore my projects and see how I bring ideas to life through code.'
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Discover my technical expertise and the tools I use to create amazing applications.'
  },
  {
    id: 'footer',
    title: 'Contact',
    description: 'Get in touch with me to discuss your next project or collaboration opportunities.'
  }
];

const App = () => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1, smoothTouch: true }}>
      <div className="app">
        <MouseFollowerEffect />
        <Navbar />
        <Header id="header" />
        <About id="about" />
        <Work id="work" />
        <Skills id="skills" />
        <Footer id="footer" />
        <LoadingPage />
        <TabSwitcher sections={sections} />
      </div>
    </ReactLenis>
  );
};

export default App;
