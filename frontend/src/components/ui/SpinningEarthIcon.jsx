import { motion } from 'framer-motion'; 
const SpinningEarthIcon = ({ iconType }) => {
  return (
    <motion.div
      animate={{
        rotate: 360, // Rotate continuously
      }}
      transition={{
        duration: 5, // Duration for one full rotation
        repeat: Infinity, // Keep spinning infinitely
        ease: 'linear', // Smooth constant speed
      }}
      className="flex justify-center items-center text-3xl  "
    >
      {iconType ==1? "♻️" :"🌎"}
       
    </motion.div>
  );
};

export default SpinningEarthIcon;
