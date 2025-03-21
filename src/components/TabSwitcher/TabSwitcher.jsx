import React, { useState, useEffect, useRef } from 'react';
import './TabSwitcher.css';

const TabSwitcher = ({ sections }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef(null);
  const helpContentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        setCtrlPressed(true);
      }

      if (ctrlPressed && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        
        if (!isVisible) {
          if (e.repeat) {
            setIsVisible(true);
          } else {
            // Toggle between current and previous section
            const temp = activeIndex;
            setActiveIndex(previousIndex);
            setPreviousIndex(temp);
            scrollToSection(previousIndex);
            setIsVisible(true);
          }
        } else {
          // Navigate forward
          navigateTab(1);
        }
      }

      if (isVisible) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateTab(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateTab(-1);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setCtrlPressed(false);
        if (isVisible) {
          setIsVisible(false);
          scrollToSection(activeIndex);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible, ctrlPressed, activeIndex, previousIndex]);

  // Close help popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHelp && helpContentRef.current && !helpContentRef.current.contains(event.target)) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHelp]);

  const navigateTab = (direction) => {
    setActiveIndex((prev) => {
      const newIndex = (prev + direction + sections.length) % sections.length;
      return newIndex;
    });
  };

  const scrollToSection = (index) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviewClick = (index) => {
    if (isVisible) {
      setActiveIndex(index);
      setIsVisible(false);
      scrollToSection(index);
    }
  };

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const container = containerRef.current;
      const previewWidth = 340; // Width + margin/gap
      const scrollPosition = activeIndex * previewWidth - (container.clientWidth - previewWidth) / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, isVisible]);

  const toggleHelp = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowHelp(!showHelp);
  };

  // Help icon component
  const HelpIcon = () => (
    <div className="help-icon" onClick={toggleHelp}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    </div>
  );

  // Help popup component
  const HelpPopup = () => (
    <div className="help-popup" onClick={() => setShowHelp(false)}>
      <div className="help-popup-content" ref={helpContentRef} onClick={(e) => e.stopPropagation()}>
        <div className="help-popup-header">
          <h3>Tab Switcher Shortcuts</h3>
          <button className="close-button" onClick={() => setShowHelp(false)}>×</button>
        </div>
        <div className="help-popup-body">
          <p><strong>Open Tab Switcher:</strong> Press <span className="keyboard-shortcut">Ctrl</span> + <span className="keyboard-shortcut">Q</span></p>
          <p><strong>Navigate Between Tabs:</strong> Use <span className="keyboard-shortcut">←</span> and <span className="keyboard-shortcut">→</span> arrow keys</p>
          <p><strong>Cycle Through Tabs:</strong> Keep holding <span className="keyboard-shortcut">Ctrl</span> and press <span className="keyboard-shortcut">Q</span> multiple times</p>
          <p><strong>Select a Tab:</strong> Release <span className="keyboard-shortcut">Ctrl</span> key or click on a tab preview</p>
          <p><strong>Quick Switch:</strong> Press <span className="keyboard-shortcut">Ctrl</span> + <span className="keyboard-shortcut">Q</span> once to switch between current and previous section</p>
          <p><strong>Open Spotlight Search:</strong> Press <span className="keyboard-shortcut">Ctrl</span> + <span className="keyboard-shortcut">Space</span></p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="help-icon-container">
        <HelpIcon />
      </div>
      
      {showHelp && <HelpPopup />}
      
      {isVisible && (
        <div className="tab-switcher-overlay">
          <div className="tab-preview-container" ref={containerRef}>
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`tab-preview ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handlePreviewClick(index)}
              >
                <div className="tab-preview-header">{section.title}</div>
                <div className="tab-preview-content">
                  <div className="tab-preview-body">{section.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="shortcut-hint">
            <span className="keyboard-shortcut">←</span>{' '}
            <span className="keyboard-shortcut">→</span> to navigate •{' '}
            <span className="keyboard-shortcut">Q</span> while holding{' '}
            <span className="keyboard-shortcut">Ctrl</span> to cycle •{' '}
            Release <span className="keyboard-shortcut">Ctrl</span> to select •{' '}
            Click on any preview to select
          </div>

          <div className="shortcut-button">
            <div className="shortcut-button-text">Q</div>
            <div className="tooltip-text">Press Ctrl+Q for tab switcher</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabSwitcher; 
