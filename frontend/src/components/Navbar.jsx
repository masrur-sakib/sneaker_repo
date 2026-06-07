import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className='bg-gray-900 text-white shadow-lg'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex justify-between items-center h-16'>
            <Link to='/' className='flex items-center space-x-2'>
              <span className='font-bold text-xl'>SneakerDrop</span>
            </Link>

            <div className='flex items-center space-x-4'>
              {user && (
                <span className='text-gray-300 mr-auto'>
                  Welcome,{' '}
                  <span className='text-white font-medium'>
                    {user.username}
                  </span>
                </span>
              )}

              {user ? (
                <>
                  <Link
                    to='/create-drop'
                    className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition'
                  >
                    Create Drop
                  </Link>

                  <button
                    onClick={handleLogout}
                    className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to='/register'
                  className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition'
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className='bg-gray-600 border-b border-gray-500'>
        <div className='max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-amber-300 text-sm'>
          <span>⚠️</span>
          <p>
            The backend is hosted on Render's free tier and may take{' '}
            <span className='font-semibold'>up to 60 seconds</span> to wake up
            on the first request. Subsequent requests will be fast.
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
