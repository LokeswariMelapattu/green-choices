import { motion } from "framer-motion";
import FireIcon from "./FireIcon";
import SpinningEarthIcon from "./SpinningEarthIcon"; 
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
        <div>
        <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-green-700 mt-2">Great! You've made an eco-friendly choice!</p>
            <LeafIcon />
          </div>
          <div> <p className="text-sm text-green-600">You're helping reduce CO₂ emissions and protect the planet!</p>
   
        </div>
        </div>
      ) : (
        <div>
        <div className="flex items-center gap-2">
          <FireIcon />
          <p className="text-red-700 ">
            <span className="font-semibold">High CO₂ Emissions! Consider a greener option.</span>It might seem convenient, but it's harming the environment. </p>
          </div>
         
     <div className="flex items-center gap-2">
    
     <p className="text-sm text-green-600 mt-2">Think about the long-term impact on our planet </p>
     <SpinningEarthIcon/>
    </div>
        </div>
      )}
    </motion.div>
  );
};

export default SustainabilityMessage;
