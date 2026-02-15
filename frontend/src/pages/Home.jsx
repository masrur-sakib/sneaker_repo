import { useState, useEffect } from 'react';
import { getAllDrops } from '../api/axios';
import DropCard from '../components/DropCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrops();
  }, []);

  const fetchDrops = async () => {
    try {
      const response = await getAllDrops();
      setDrops(response.data);
    } catch (err) {
      setError('Failed to load drops. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message='Loading drops...' />;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>
          🔥 Active Drops
        </h1>
        <p className='text-gray-600 text-lg'>
          Limited edition sneakers. First come, first served.
        </p>
      </div>

      {error && (
        <div className='bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center'>
          {error}
        </div>
      )}

      {drops.length === 0 ? (
        <div className='text-center py-12'>
          <span className='text-6xl mb-4 block'>😴</span>
          <h2 className='text-2xl font-semibold text-gray-700'>
            No active drops
          </h2>
          <p className='text-gray-500 mt-2'>
            Check back later for new releases!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {drops.map((drop) => (
            <DropCard key={drop.id} drop={drop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
