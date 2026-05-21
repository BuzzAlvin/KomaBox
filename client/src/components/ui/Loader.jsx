const Loader = ({ className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className="
          w-6 h-6
          sm:w-8 sm:h-8
          md:w-10 md:h-10
          lg:w-12 lg:h-12
          border-4
          border-gray-300
          border-t-brand
          rounded-full
          animate-spin
        "
      />
    </div>
  );
};

export default Loader;