import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MapPin, CheckCircle, Package, Truck, Home, Clock, ArrowRight, AlertCircle, CircleCheck } from 'lucide-react';
import useRoutes from '../../../hooks/useRoutes';
import { format, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TrackingDetails = ({ selectedRoute, order, arrivalDate, isLoading }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  console.log('useRoutes data:', { selectedRoute, isLoading });
  useEffect(() => {
    if (!isLoading && selectedRoute) {
      controls.start("visible");
    }
  }, [isLoading, selectedRoute, controls]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Package className="h-16 w-16 text-green-600" />
        </motion.div>
      </div>
    );
  }

  if (!selectedRoute) {
    navigate('/');
    return null;
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Date pending';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date pending';
    }
  };

  // Get first and last segments
  const segments = selectedRoute.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  // Generate date range safely
  let dateRange = 'Dates to be determined';
  if (firstSegment?.departureTime && lastSegment?.arrivalTime) {
    const startDate = formatDate(firstSegment.departureTime);
    const endDate = formatDate(lastSegment.arrivalTime);
    dateRange = `${startDate} - ${endDate}`;
  }

  const calculateArrivalDate = (departureDate, durationInDays) => {
    const createdDateObj = new Date(departureDate);
    createdDateObj.setDate(createdDateObj.getDate() + durationInDays);
    return createdDateObj;
  };

  const now = new Date();
  const segmentsWithArrival = segments.map((segment, index) => {
    const totalDurationUpToCurrent = segments
      .slice(0, index + 1)
      .reduce((sum, seg) => sum + (seg.durations[0] || 0), 0);

    const arrivalTime = calculateArrivalDate(order?.createdat, totalDurationUpToCurrent);

    return {
      ...segment,
      calculatedArrivalTime: arrivalTime
    };
  });

  console.log(segmentsWithArrival);
  const currentStep = segmentsWithArrival.findIndex(seg => seg.calculatedArrivalTime > now);
  console.log(currentStep);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusIcon = (index) => {
    if (index < currentStep) {
      return <ArrowRight className="h-5 w-5 text-green-600" />;
    } else if (index === currentStep) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col mt-4 md:mt-6">
      <motion.div
        className="space-y-6 bg-white rounded-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Order Number and Date */}
        <motion.div variants={itemVariants}>
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-green-600"
          >
            Order #{order?.orderid || '1'}
          </motion.h1>
          <p className="text-md md:text-lg text-blue-600 mt-2">
            Arriving before {arrivalDate}
          </p>
        </motion.div>

        {/* Tracking Details */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl md:text-2xl font-bold mb-6">Tracking Details</h2>

          <div className="space-y-6">
            {segments.map((segment, index) => {
              const totalDurationUpToCurrent = segments
              .slice(0, index + 1)
              .reduce((sum, seg) => sum + seg.durations[0], 0);
          
            // Calculate the segment's arrival date
            const arrivalDate = calculateArrivalDate(order?.createdat, totalDurationUpToCurrent);
          
              return (
              <motion.div
                key={index}
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <div className="relative">
                  <motion.div
                    className={`p-2 rounded-full ${index < currentStep
                      ? "bg-green-100"
                      : index === currentStep
                        ? "bg-blue-100"
                        : "bg-gray-100"
                      }`}
                    animate={
                      index === currentStep
                        ? {
                          boxShadow: [
                            "0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 8px rgba(59, 130, 246, 0.6)",
                            "0 0 0 rgba(59, 130, 246, 0)"
                          ]
                        }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {index === 0 ? (
                      <Home className={`h-5 w-5 ${index < currentStep
                        ? "text-green-600"
                        : index === currentStep
                          ? "text-blue-600"
                          : "text-gray-400"
                        }`} />
                    ) : index === segments.length - 1 ? (
                      <MapPin className={`h-5 w-5 ${index < currentStep
                        ? "text-green-600"
                        : index === currentStep
                          ? "text-blue-600"
                          : "text-gray-400"
                        }`} />
                    ) : (
                      <Truck className={`h-5 w-5 ${index < currentStep
                        ? "text-green-600"
                        : index === currentStep
                          ? "text-blue-600"
                          : "text-gray-400"
                        }`} />
                    )}
                  </motion.div>
                  {index !== segments.length - 1 && (
                    <motion.div
                      className="absolute top-10 left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2"
                      initial={{ height: 0 }}
                      animate={{ height: 48 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <h3 className="text-base md:text-lg font-semibold">
                    {segment.from || `Location ${index + 1}`}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm md:text-md ${index < currentStep
                      ? "text-green-600"
                      : index === currentStep
                        ? "text-blue-600"
                        : "text-gray-500"
                      }`}>
                      {index < currentStep ? (
                        <span className="flex items-center">
                          Delivered
                          <CircleCheck className="ml-2 h-5 w-5" />
                        </span>
                      ) : index === currentStep ? (
                        <span className="flex items-center">
                          In transit
                          <Clock className="ml-2 h-5 w-5" />
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Waiting
                          <AlertCircle className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(arrivalDate)}
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tracking Number and Carrier Info */}
        <motion.div
          className="space-y-2 mt-8 p-4 border rounded-lg bg-gray-50"
          variants={itemVariants}
        >
          <div className=" md:justify-between md:items-center">
            <p className="text-lg md:text-xl font-semibold">
              Tracking number:
              <motion.span
                className="ml-2 font-mono"
                whileHover={{ color: "#4ade80" }}
              >
                {selectedRoute.trackingNumber || selectedRoute.routeNumber || '1234567890'}
              </motion.span>
            </p>
            <p className="text-md md:text-lg text-gray-600">
              Carrier: {selectedRoute.carrier || 'Demola'}
            </p>
          </div>
          <p className="text-md md:text-lg text-green-600 font-medium">
            Economic Shipping
          </p>
        </motion.div>

        {/* Homepage Button */}
        <motion.button
          onClick={() => window.location.href = '/home'}
          className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          variants={itemVariants}
        >
          Go to Homepage
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TrackingDetails;