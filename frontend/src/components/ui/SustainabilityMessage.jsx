import { motion } from "framer-motion";
import FireIcon from "./FireIcon";
import BurningPlantIcon from "./BurningPlantIcon";
import LeafIcon from "./LeafIcon";
const SustainabilityMessage = ({ isLowSustainable }) => {
  return (
    <motion.div
      key={isLowSustainable} // Forces re-animation when state changes
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-4 mt-4 rounded-lg shadow-md flex items-center gap-2 ${
        isLowSustainable ? "bg-red-100" : "bg-green-100"
      }`}
    >
      {!isLowSustainable ? (
        <div className="flex items-center gap-2">
       <LeafIcon />
          <p className="text-green-700 font-semibold">Great Choice! This option is eco-friendly </p>
          
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FireIcon />
          <p className="text-red-700 font-semibold">High CO₂ Emissions! Consider a greener option.</p>
          
        </div>
      )}
    </motion.div>
  );
};

export default SustainabilityMessage;
