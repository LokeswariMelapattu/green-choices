import { motion } from "framer-motion";

const WarningIcon = () => {
  return (
    <motion.span
      className="text-3xl text-yellow-500" // Large & Yellow Warning Icon
      initial={{ rotate: 0 }}
      animate={{ rotate: [-10, 10, -10, 10, 0] }} // Shaking effect
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
    >
      ⚠️
    </motion.span>
  );
};

export default WarningIcon;
