import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState(['home']);

  const navigate = useCallback((tab) => {
    setActiveTab(tab);
    setNavigationHistory(prev => [...prev, tab]);
  }, []);

  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      const previousTab = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveTab(previousTab);
    }
  }, [navigationHistory]);

  const canGoBack = navigationHistory.length > 1;

  const value = {
    activeTab,
    setActiveTab,
    navigate,
    goBack,
    canGoBack,
    navigationHistory
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
