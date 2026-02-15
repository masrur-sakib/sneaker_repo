import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import PurchaseToast from './components/PurchaseToast';
import Home from './pages/Home';
import Register from './pages/Register';
import DropDetail from './pages/DropDetail';
import Purchase from './pages/Purchase';
import Login from './pages/Login';
import CreateDrop from './pages/CreateDrop';

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <BrowserRouter>
          <div className='min-h-screen bg-gray-100'>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/create-drop' element={<CreateDrop />} />
              <Route path='/drops/:id' element={<DropDetail />} />
              <Route path='/purchase/:id' element={<Purchase />} />
            </Routes>
            <PurchaseToast />
          </div>
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
