import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDropById, createNewReservation } from '../api/axios';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import StockBadge from '../components/StockBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const DropDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { stockUpdates } = useSocket();

  const [drop, setDrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrop();
  }, [id]);

  // Show toast when stock updates to 0 from socket
  useEffect(() => {
    if (drop && stockUpdates[drop.id] === 0) {
      toast.error('Item just sold out! Another user grabbed the last one.', {
        duration: 5000,
        icon: '🔥',
      });
    }
  }, [stockUpdates, drop]);

  const fetchDrop = async () => {
    try {
      const response = await getDropById(id);
      setDrop(response.data);
    } catch (err) {
      setError(`${err} Failed to load drop details.`);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    setReserving(true);
    setError('');

    try {
      const reservationResponse = await createNewReservation({
        userId: user.id,
        dropId: id,
      });
      const reservationData = reservationResponse.data.reservation;

      toast.success('Reservation successful!', { duration: 3000 });

      navigate(`/purchase/${reservationData.id}`, {
        state: { reservation: reservationData, drop },
      });
    } catch (err) {
      const status = err.response?.status;
      const errorMessage = err.response?.data?.error;

      if (status === 400 && errorMessage?.includes('stock')) {
        // Stock ran out due to concurrent requests
        toast.error(
          'Sorry! This item just sold out while you were reserving.',
          {
            duration: 5000,
            icon: '⚡',
          },
        );
        setError(
          'Item sold out. Another user completed their reservation first.',
        );
      } else if (status === 400) {
        toast.error(errorMessage || 'You already have an active reservation.', {
          duration: 4000,
        });
        setError(errorMessage || 'You already have an active reservation.');
      } else if (status === 409) {
        toast.error('Unable to reserve. Item may be out of stock.', {
          duration: 4000,
        });
        setError(
          errorMessage || 'Unable to reserve. Item may be out of stock.',
        );
      } else if (status === 404) {
        toast.error('This drop no longer exists.', { duration: 4000 });
        setError('Drop not found.');
      } else {
        toast.error('Reservation failed. Please try again.', {
          duration: 4000,
        });
        setError('Reservation failed. Please try again.');
      }

      // Refresh drop to get updated stock
      fetchDrop();
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <LoadingSpinner message='Loading drop details...' />;

  if (!drop) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-12 text-center'>
        <span className='text-6xl'>😕</span>
        <h2 className='text-2xl font-bold text-gray-700 mt-4'>
          Drop not found
        </h2>
      </div>
    );
  }

  const availableStock = stockUpdates[drop.id] ?? drop.availableStock;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center'>
          {drop.imageUrl ? (
            <img
              src={drop.imageUrl}
              alt={drop.name}
              className='h-full w-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}

          <span className={`${drop.imageUrl ? 'hidden' : 'block'} text-6xl`}>
            👟
          </span>
        </div>

        <div className='p-8'>
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>{drop.name}</h1>
              <p className='text-gray-500 mt-1'>
                Drop started:{' '}
                {dayjs(drop.startsAt).format('MMMM D, YYYY h:mm A')}
              </p>
            </div>
            <StockBadge stock={availableStock} />
          </div>

          <p className='text-gray-600 text-lg mb-6'>
            {drop.description ||
              "Limited edition sneaker drop. Get yours before they're gone!"}
          </p>

          <div className='grid grid-cols-2 gap-4 mb-8'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-gray-500 text-sm'>Price</p>
              <p className='text-3xl font-bold text-green-600'>
                ${parseFloat(drop.price).toFixed(2)}
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-gray-500 text-sm'>Available Stock</p>
              <p className='text-3xl font-bold text-gray-800'>
                {availableStock}
              </p>
            </div>
          </div>

          {drop.endsAt && (
            <div className='bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6'>
              <p className='text-yellow-800'>
                ⏰ This drop ends on{' '}
                {dayjs(drop.endsAt).format('MMMM D, YYYY h:mm A')}
              </p>
            </div>
          )}

          {error && (
            <div className='bg-red-100 text-red-700 p-4 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <button
            onClick={handleReserve}
            disabled={availableStock === 0 || reserving}
            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
              availableStock > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } disabled:opacity-50`}
          >
            {reserving
              ? 'Reserving...'
              : availableStock > 0
                ? `Reserve Now - $${parseFloat(drop.price).toFixed(2)}`
                : 'Sold Out'}
          </button>

          {!user && availableStock > 0 && (
            <p className='text-center text-gray-500 mt-4'>
              Please{' '}
              <span
                onClick={() => navigate('/register')}
                className='text-blue-600 cursor-pointer hover:underline'
              >
                register
              </span>{' '}
              to reserve this drop
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropDetail;
