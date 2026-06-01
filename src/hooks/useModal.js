import { useState, useCallback, useRef, useEffect } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);
  const previousFocusRef = useRef(null);

  const open = useCallback((modalData = null) => {
    previousFocusRef.current = document.activeElement;
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
    if (previousFocusRef.current) {
      setTimeout(() => {
        previousFocusRef.current?.focus();
      }, 10);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return { isOpen, data, open, close, toggle };
};

export const useMultipleModals = () => {
  const [modals, setModals] = useState({});

  const openModal = useCallback((modalId, data = null) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { isOpen: true, data },
    }));
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { isOpen: false, data: null },
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({});
  }, []);

  const isAnyOpen = Object.values(modals).some(m => m.isOpen);

  return { modals, openModal, closeModal, closeAllModals, isAnyOpen };
};

export const useModalStack = (maxDepth = 5) => {
  const [stack, setStack] = useState([]);

  const push = useCallback((modalData) => {
    setStack(prev => {
      if (prev.length >= maxDepth) {
        return prev;
      }
      return [...prev, modalData];
    });
  }, [maxDepth]);

  const pop = useCallback(() => {
    setStack(prev => prev.slice(0, -1));
  }, []);

  const replace = useCallback((modalData) => {
    setStack(prev => [...prev.slice(0, -1), modalData]);
  }, []);

  const clear = useCallback(() => {
    setStack([]);
  }, []);

  const current = stack[stack.length - 1] || null;
  const isOpen = stack.length > 0;
  const depth = stack.length;

  return { stack, push, pop, replace, clear, current, isOpen, depth };
};

export default {
  useModal,
  useMultipleModals,
  useModalStack,
};