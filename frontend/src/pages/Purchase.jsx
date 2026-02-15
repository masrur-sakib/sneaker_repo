import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { completePurchase, cancelReservation } from '../api/axios';
import ReservationTimer from '../components/ReservationTimer';

const Purchase = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [reservation] = useState(location.state?.reservation || null);
  const [drop] = useState(location.state?.drop || null);
  const [processing, setProcessing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!reservation) {
      navigate('/');
    }
  }, [reservation, navigate]);

  const handlePurchase = async () => {
    setProcessing(true);
    setError('');

    try {
      await completePurchase({ reservationId: id });
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 410) {
        setError('Your reservation has expired. Please try again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid reservation.');
      } else {
        setError(
          err.response?.data?.error || 'Purchase failed. Please try again.',
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelReservation(id);
      navigate('/');
    } catch (err) {
      setError(`${err}, Failed to cancel reservation.`);
      setCancelling(false);
    }
  };

  const handleExpire = () => {
    setError('Your reservation has expired. Please go back and try again.');
  };

  if (!reservation || !drop) return null;

  if (success) {
    return (
      <div className='max-w-2xl mx-auto px-4 py-12'>
        <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
          <div className='text-6xl mb-4'>🎉</div>
          <h1 className='text-3xl font-bold text-green-600 mb-4'>
            Purchase Successful!
          </h1>
          <p className='text-gray-600 mb-6'>
            Congratulations! You've successfully purchased{' '}
            <strong>{drop.name}</strong>.
          </p>
          <div className='bg-green-50 p-6 rounded-lg mb-6'>
            <p className='text-green-800 font-semibold'>Order Confirmed</p>
            <p className='text-green-600'>
              Total paid: ${parseFloat(drop.price).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition'
          >
            Back to Drops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center'>
          <h1 className='text-2xl font-bold'>Complete Your Purchase</h1>
          <p className='text-blue-100 mt-1'>Your item is reserved!</p>
        </div>

        <div className='p-6'>
          <ReservationTimer
            expiresAt={reservation.expiresAt}
            onExpire={handleExpire}
          />

          <div className='mt-6 bg-gray-50 p-6 rounded-lg'>
            <div className='flex items-center space-x-4'>
              <div className='w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center'>
                {drop.imageUrl ? (
                  <img
                    src={drop.imageUrl}
                    alt={drop.name}
                    className='h-full w-full object-cover'
                    // Basic error handling to show the emoji if the link breaks
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
              </div>
              <div className='flex-1'>
                <h3 className='font-bold text-lg text-gray-800'>{drop.name}</h3>
                <p className='text-gray-500'>Quantity: 1</p>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-green-600'>
                  ${parseFloat(drop.price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6 border-t pt-6'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-gray-600'>Subtotal</span>
              <span className='font-semibold'>
                ${parseFloat(drop.price).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-gray-600'>Shipping</span>
              <span className='font-semibold text-green-600'>Free</span>
            </div>
            <div className='flex justify-between items-center text-xl font-bold border-t pt-4'>
              <span>Total</span>
              <span className='text-green-600'>
                ${parseFloat(drop.price).toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className='mt-6 bg-red-100 text-red-700 p-4 rounded-lg'>
              {error}
            </div>
          )}

          <div className='mt-8 space-y-4'>
            <button
              onClick={handlePurchase}
              disabled={processing || error}
              className='w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50'
            >
              {processing
                ? 'Processing...'
                : `Pay $${parseFloat(drop.price).toFixed(2)}`}
            </button>

            <button
              onClick={handleCancel}
              disabled={cancelling || error}
              className='w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition disabled:opacity-50'
            >
              {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
