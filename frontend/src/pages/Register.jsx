import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createNewUser } from '../api/axios';
import { useUser } from '../context/UserContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createNewUser(formData);
      login(response.data);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Email already registered. Please use a different email.');
      } else {
        setError(
          err.response?.data?.error || 'Registration failed. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <span className='text-6xl'>👟</span>
          <h1 className='text-3xl font-bold text-gray-800 mt-4'>
            Join SneakerDrop
          </h1>
          <p className='text-gray-600 mt-2'>
            Register to start copping exclusive drops
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          {error && (
            <div className='bg-red-100 text-red-700 p-4 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label
                htmlFor='username'
                className='block text-gray-700 font-medium mb-2'
              >
                Full Name
              </label>
              <input
                type='text'
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                placeholder='Enter your user name'
              />
            </div>

            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block text-gray-700 font-medium mb-2'
              >
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                placeholder='Enter your email'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className='mt-4 text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
