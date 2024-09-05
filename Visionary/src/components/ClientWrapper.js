// components/ClientWrapper.js
"use client";

import { SessionProvider } from "next-auth/react";

const ClientWrapper = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export default ClientWrapper;
