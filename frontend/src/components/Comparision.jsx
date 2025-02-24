import React from 'react'
import useRoutes from '../hooks/useRoutes'

const Comparision = () => {
    const {totalEmissions, route} = useRoutes();
    
    const getEmissionColor = (value) => {
        if (value < 300) return 'bg-green-500';
        if (value < 600) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div>
            {totalEmissions.map((item, index) => (
                <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span>Route {item.name}</span>
                        <span>{item.minTotalEmissions.toFixed(2)} kgCO₂</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`${getEmissionColor(item.minTotalEmissions)} h-2 rounded-full`}
                            style={{
                                width: `${(item.minTotalEmissions / 1000) * 100}%`
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Comparision