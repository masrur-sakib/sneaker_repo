import { useSocket } from '../context/SocketContext';

const PurchaseToast = () => {
  const { recentPurchase } = useSocket();

  if (!recentPurchase) return null;

  return (
    <div className='fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-pulse z-50'>
      <p className='font-semibold'>🎉 New Purchase!</p>
      <p className='text-sm text-green-100'>
        {recentPurchase.username} just copped a pair!
      </p>
    </div>
  );
};

export default PurchaseToast;
