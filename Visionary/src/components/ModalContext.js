"use client";
import { createContext, useState, useContext } from 'react';

const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
  isOpen: false,
  title: '',
  content: null,
});

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);

  const openModal = (options) => {
    setTitle(options.title);
    setContent(options.content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const value = {
    openModal,
    closeModal,
    isOpen,
    title,
    content,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}