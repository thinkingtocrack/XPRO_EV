import React from 'react'

const RoutesPlan = ({routeDirection}) => {
    const steps = routeDirection?.legs?.flatMap(leg => leg.steps) || [];

    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white px-4 py-2 flex items-center">
          <h2 className="text-lg font-semibold">Route Steps</h2>
        </div>
        {steps.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {steps.map((step, index) => (
              <li key={index} className="px-4 py-3">
                <p className="text-sm text-gray-600">{step.instructions}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {step.distance?.text || 'N/A'} - {step.duration?.text || 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-3 text-gray-600">No route steps available.</p>
        )}
      </div>
    );
}

export default RoutesPlan