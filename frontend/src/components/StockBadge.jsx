const StockBadge = ({ stock }) => {
  const getBadgeStyle = () => {
    if (stock === 0) return 'bg-red-100 text-red-800 border-red-200';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getText = () => {
    if (stock === 0) return 'Sold Out';
    if (stock <= 5) return `Only ${stock} left!`;
    return `${stock} Available`;
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        whitespace-nowrap w-fit
        px-2 py-1
        rounded-full text-sm font-semibold border
        ${getBadgeStyle()}
      `}
    >
      {getText()}
    </span>
  );
};

export default StockBadge;
