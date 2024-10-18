import { useState,useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useAuthApi from '../../../utils/apis/axios/axiosInstance';

const ChargingHistory = () => {

  const api = useAuthApi()
  const [charges, setCharges] = useState([]);
  // Sample data for charging sessions

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
  }, [api]);

  return (
    <div className="p-6 basis-120  max-w-4xl mx-auto bg-slate-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Energy Consumption Chart</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Displaying energy consumption for recent charging sessions</p>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={charges} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="startTime" 
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', fill: '#4B5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F3F4F6',
                border: 'none',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="energyConsumed" 
              fill="#60A5FA"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChargingHistory