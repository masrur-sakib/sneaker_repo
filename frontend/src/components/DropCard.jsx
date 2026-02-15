import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import StockBadge from './StockBadge';
import dayjs from 'dayjs';

const DropCard = ({ drop }) => {
  const { stockUpdates } = useSocket();

  // Use real-time stock if available, otherwise use drop's availableStock
  const currentStock = stockUpdates[drop.id] ?? drop.availableStock;

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
      <div className='h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center'>
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

        {/* Fallback Emoji (Hidden unless image fails or is missing) */}
        <span className={`${drop.imageUrl ? 'hidden' : 'block'} text-6xl`}>
          👟
        </span>
      </div>

      <div className='p-6'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-xl font-bold text-gray-800'>{drop.name}</h3>
          <StockBadge stock={currentStock} />
        </div>

        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
          {drop.description || 'Limited edition sneaker drop'}
        </p>

        <div className='flex justify-between items-center mb-4'>
          <span className='text-2xl font-bold text-green-600'>
            ${parseFloat(drop.price).toFixed(2)}
          </span>
          <span className='text-sm text-gray-500'>
            {drop.endsAt
              ? dayjs(drop.endsAt).format('MMM D, h:mm A')
              : 'No end date'}
          </span>
        </div>

        <Link
          to={`/drops/${drop.id}`}
          className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
            currentStock > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
          }`}
        >
          {currentStock > 0 ? 'View Drop' : 'Sold Out'}
        </Link>
      </div>
    </div>
  );
};

export default DropCard;
