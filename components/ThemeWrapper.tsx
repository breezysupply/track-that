"use client";

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
      <ThemeToggle />
    </ThemeProvider>
  );
};

export default ThemeWrapper;
