import React, { useEffect, useState } from "react";

const EmissionMeter = ({ currentValue, maxValue, onEmissionsClick, className = "" }) => {
  const [rotation, setRotation] = useState(-90);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const percentage = (currentValue / maxValue) * 70;
    const newRotation = (percentage / 100) * 180 - 90;
    // Update rotation with animation through CSS variable
    document.documentElement.style.setProperty(
      "--rotation",
      `${newRotation}deg`
    );
    setRotation(newRotation);

    // Determine label and color based on percentage
    if (percentage <= 20) {
      setLabel("Low");
      setColor("#22c55e"); // Green
    } else if (percentage <= 40) {
      setLabel("Moderate");
      setColor("#84cc16"); // Light green
    } else if (percentage <= 60) {
      setLabel("Medium");
      setColor("#fbbf24"); // Yellow
    } else if (percentage <= 80) {
      setLabel("High");
      setColor("#f97316"); // Orange
    } else {
      setLabel("Critical");
      setColor("#ef4444"); // Red
    }
  }, [currentValue, maxValue]);

  return (
    <div className={`w-full max-w-md mx-auto p-2 ${className}`}>
      <h2 className="text-2xl font-semibold text-center mb-1 text-gray-800">
        Carbon Emission
      </h2>

      <div className="relative aspect-[2/1.6] w-full">
        {/* Meter Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full max-w-[300px] relative">
            {/* Meter Arc Background */}
            <svg className="w-full" viewBox="0 0 200 150">
              <defs>
                <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" style={{ stopColor: "#22c55e" }} />
                  <stop offset="25%" style={{ stopColor: "#84cc16" }} />
                  <stop offset="50%" style={{ stopColor: "#fbbf24" }} />
                  <stop offset="75%" style={{ stopColor: "#f97316" }} />
                  <stop offset="100%" style={{ stopColor: "#ef4444" }} />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M20 130 A80 80 0 0 1 180 130"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Colored Arc */}
              <path
                d="M20 130 A80 80 0 0 1 180 130"
                fill="none"
                stroke="url(#meterGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>

            {/* Meter Needle */}
            <div
              className="absolute left-1/2 bottom-[73px] -translate-x-1/2 origin-bottom"
              style={{
                width: "4px",
                height: "60px",
                backgroundColor: color,
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease",
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        </div>

        {/* Value Display */}
        <div className="absolute bottom-8 left-0 right-0 text-center pb-4">
          <div className="inline-block bg-white px-4 py-2 rounded-full shadow-md">
            <p className="text-gray-600 font-medium">
              {label}: {currentValue.toLocaleString()} kg

            </p>
          </div>
        </div>
      </div>
      {(currentValue / maxValue) * 70 > 40 && (
        <div className="flex items-center ">
          <img src="/imgs/earth.png" className="h-[40px] w-[40px]" />
          <p className="text-center " style={{ color: color }}>
            A Little More CO₂ Than We'd Like … But <span
              className="font-bold cursor-pointer"
              onClick={onEmissionsClick}
            >
              Here's Why
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmissionMeter;
