import { motion } from "framer-motion";

const TreeIcon = () => {
  return (
    <motion.span
      className="text-3xl" // Increased size
      initial={{ scale: 0.9, rotate: 0 }}
      animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
    >
      🌱
  
    </motion.span>
  );
};

export default TreeIcon;
