import { motion } from 'framer-motion'; 
const SpinningSuccess = ({className}) => {
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
        <img
                    src="/imgs/success.png"
                    alt="Success checkmark"
                    width={214}
                    height={214}
                    className={className}
                    /> 
    </motion.div>
  );
};

export default SpinningSuccess;
