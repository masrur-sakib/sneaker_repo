import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDrop } from '../api/axios';

const CreateDrop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    totalStock: '',
    startsAt: '',
    endsAt: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dropData = {
        name: formData.name,
        price: parseFloat(formData.price),
        totalStock: parseInt(formData.totalStock),
        startsAt: formData.startsAt
          ? new Date(formData.startsAt).toISOString()
          : new Date().toISOString(),
        endsAt: formData.endsAt
          ? new Date(formData.endsAt).toISOString()
          : null,
        imageUrl: formData.imageUrl || null,
      };

      await createDrop(dropData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create drop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-center mb-6'>Create New Drop</h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Drop Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter drop name'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='price'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Price ($) *
              </label>
              <input
                type='number'
                id='price'
                name='price'
                value={formData.price}
                onChange={handleChange}
                required
                min='0'
                step='0.01'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='0.00'
              />
            </div>

            <div>
              <label
                htmlFor='totalStock'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Total Stock *
              </label>
              <input
                type='number'
                id='totalStock'
                name='totalStock'
                value={formData.totalStock}
                onChange={handleChange}
                required
                min='1'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='100'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='startsAt'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Start Date/Time
              </label>
              <input
                type='datetime-local'
                id='startsAt'
                name='startsAt'
                value={formData.startsAt}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Leave empty to start immediately
              </p>
            </div>

            <div>
              <label
                htmlFor='endsAt'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                End Date/Time
              </label>
              <input
                type='datetime-local'
                id='endsAt'
                name='endsAt'
                value={formData.endsAt}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Leave empty for no end date
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor='imageUrl'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Image URL
            </label>
            <input
              type='url'
              id='imageUrl'
              name='imageUrl'
              value={formData.imageUrl}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='https://example.com/image.jpg'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Creating...' : 'Create Drop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDrop;
