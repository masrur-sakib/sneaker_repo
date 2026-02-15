import { useState, useEffect, useCallback } from 'react';

const calculateTimeLeft = (expiresAt) => {
  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const difference = expiry - now;

  if (difference <= 0) {
    return { time: '00:00', expired: true, isUrgent: true };
  }

  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  const isUrgent = difference < 60000; // Less than 1 minute

  return {
    time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    expired: false,
    isUrgent,
  };
};

const ReservationTimer = ({ expiresAt, onExpire }) => {
  // Lazy initialization
  const [timerState, setTimerState] = useState(() =>
    calculateTimeLeft(expiresAt),
  );

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  useEffect(() => {
    // If already expired on mount, trigger callback
    if (timerState.expired) {
      handleExpire();
      return;
    }

    const timer = setInterval(() => {
      const newState = calculateTimeLeft(expiresAt);
      setTimerState(newState);

      if (newState.expired) {
        clearInterval(timer);
        handleExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, handleExpire, timerState.expired]);

  return (
    <div
      className={`text-center p-4 rounded-lg ${timerState.isUrgent ? 'bg-red-100' : 'bg-blue-100'}`}
    >
      <p
        className={`text-sm ${timerState.isUrgent ? 'text-red-600' : 'text-blue-600'}`}
      >
        Time remaining to complete purchase
      </p>
      <p
        className={`text-4xl font-mono font-bold ${timerState.isUrgent ? 'text-red-700' : 'text-blue-700'}`}
      >
        {timerState.time}
      </p>
      {timerState.isUrgent && !timerState.expired && (
        <p className='text-red-600 text-sm mt-2 animate-pulse'>
          Hurry! Your reservation is about to expire!
        </p>
      )}
      {timerState.expired && (
        <p className='text-red-600 text-sm mt-2 font-semibold'>
          Your reservation has expired
        </p>
      )}
    </div>
  );
};

export default ReservationTimer;
