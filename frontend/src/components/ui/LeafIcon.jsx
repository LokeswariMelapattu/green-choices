import { motion } from "framer-motion";

const LeafIcon = () => {
  return (
    <motion.span
      className="text-5xl" // Bigger tree icon
      initial={{ scale: 1, rotate: 0 }}
      animate={{
        scale: [1, 1.1, 1], // Growing effect
        rotate: [-5, 5, -5], // Swaying movement
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      🌿
    </motion.span>
  );
};

export default LeafIcon;
