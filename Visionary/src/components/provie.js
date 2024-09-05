"use client";
import React,{Suspense} from 'react';
import { SessionProvider } from 'next-auth/react';
import Sidebar from './Sidebar';

const AppProvider = ({ children }) => {
  return (
    <SessionProvider>
    
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </SessionProvider>
  );
};

export default AppProvider;
