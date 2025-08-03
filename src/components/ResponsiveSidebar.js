/**
 * Responsive Sidebar Component
 */
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Sidebar.css';

const ResponsiveSidebar = ({ children }) => {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarCollapsed, sidebarCollapsed]);

  // Handle overlay for mobile
  useEffect(() => {
    if (isMobile) {
      setShowOverlay(!sidebarCollapsed);
    } else {
      setShowOverlay(false);
    }
  }, [isMobile, sidebarCollapsed]);

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && !sidebarCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, sidebarCollapsed]);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label="Toggle menu"
        >
          {sidebarCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      )}

      {/* Overlay for mobile */}
      {showOverlay && (
        <div 
          className="sidebar-overlay"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'} ${isMobile ? 'mobile' : 'desktop'}`}
        aria-label="Navigation"
      >
        {children}
      </aside>
    </>
  );
};

export default ResponsiveSidebar;