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
                <span className='text-white font-medium'>{user.username}</span>
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
  );
};

export default Navbar;
