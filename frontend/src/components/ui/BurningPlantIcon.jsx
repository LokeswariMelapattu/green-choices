import { motion } from "framer-motion";

const BurningPlantIcon = () => {
  return (
    <motion.span
      className="text-3xl"
      initial={{ opacity: 1, y: 0 }}
      animate={{
        scale: [1, 1.2, 1], // Growing effect
        opacity: [1, 0.8, 1], // Flickering effect
        y: [0, -5, 0], // Simulate flickering rise
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="text-red-600">🔥</span> 
      <span className="text-green-500">🌱</span>
    </motion.span>
  );
};

export default BurningPlantIcon;
