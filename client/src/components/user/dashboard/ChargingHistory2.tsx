import React, { useEffect, useState } from 'react';
import useAuthApi from '../../../utils/apis/axios/axiosInstance';

const ChargingHistory2 = () => {

    const api = useAuthApi()
  const [charges, setCharges] = useState([

  ]
  );

  useEffect(() => {
    // Fetch the data from backend
    const fetchCharges = async () => {
      try {
        const response = await api.get('/api/user/charger/sessions');
        setCharges(response.data.data)
      } catch (error) {
        console.error('Error fetching charge data:', error);
      }
    };

    fetchCharges();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Charging History</h2>
      <ul className="space-y-4">
        {charges.map((charge, index) => (
          <li key={index} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Start Time: {new Date(charge.startTime).toLocaleString()}</p>
                <p className="font-semibold">End Time: {new Date(charge.endTime).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Total Cost: Rs.{charge.cost.toFixed(2)}</p>
                <p className="font-semibold">Total Energy: {charge.energyConsumed.toFixed(2)} kWh</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChargingHistory2;
