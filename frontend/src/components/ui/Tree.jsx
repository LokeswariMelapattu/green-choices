import { motion } from "framer-motion";

const Tree = () => {
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
      <img
    className="w-[100px] h-26"
    alt="Fuel Type Icon"
    src=  "/imgs/earth-hands.png" 
  />
    </motion.span>
  );
};

export default Tree;
