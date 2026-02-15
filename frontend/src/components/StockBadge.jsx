const StockBadge = ({ stock }) => {
  const getBadgeStyle = () => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getText = () => {
    if (stock === 0) return 'Sold Out';
    if (stock <= 5) return `Only ${stock} left!`;
    return `${stock} in stock`;
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeStyle()}`}
    >
      {getText()}
    </span>
  );
};

export default StockBadge;
