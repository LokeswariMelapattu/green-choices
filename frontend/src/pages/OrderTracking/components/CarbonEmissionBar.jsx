export default function CarbonEmissionBar({ value, maxValue = 1000 }) {
  // Calculate the percentage for positioning the marker
  const percentage = ((value + maxValue) / (2 * maxValue)) * 100;

  return (
    <div className='flex flex-col items-center w-full'>


      <div className="w-full h-6 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-full relative overflow-hidden">
        <div
          className="absolute h-full w-1 bg-gray-800 top-0"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
};

