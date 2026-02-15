/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [stockUpdates, setStockUpdates] = useState({});
  const [recentPurchase, setRecentPurchase] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    // Listen for stock updates
    socket.on('stock-updated', (data) => {
      console.log('Stock updated:', data);
      setStockUpdates((prev) => ({
        ...prev,
        [data.dropId]: data.availableStock,
      }));
    });

    // Listen for purchase completions
    socket.on('purchase-completed', (data) => {
      console.log('Purchase completed:', data);
      setRecentPurchase(data);

      // Clear notification after 5 seconds
      setTimeout(() => {
        setRecentPurchase(null);
      }, 5000);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.close();
    };
  }, []);

  const value = useMemo(
    () => ({ stockUpdates, recentPurchase }),
    [stockUpdates, recentPurchase],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
