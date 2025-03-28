import { motion } from "framer-motion";

const ExhaustIcon = () => {
  return (
    <motion.span
      className="text-3xl"
      initial={{ x: 0 }}
      animate={{ x: [-5, 5, -5] }} // Side-to-side movement
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      💨
    </motion.span>
  );
};

export default ExhaustIcon;
