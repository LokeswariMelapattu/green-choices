import { motion } from "framer-motion";

const FireIcon = () => {
  return (
    <motion.span
      className="text-3xl" // Increased size
      initial={{ scale: 0.9, y: 0 }}
      animate={{ scale: [1, 1.2, 1], y: [-3, 3, -3] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      🔥
    </motion.span>
  );
};

export default FireIcon;
