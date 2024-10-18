import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const IconSVG = ({ d }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const UsersIcon = () => <IconSVG d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />;
const ShoppingCartIcon = () => <IconSVG d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />;
const DollarSignIcon = () => <IconSVG d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const FileTextIcon = () => <IconSVG d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />;
const BellIcon = () => <IconSVG d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />;
const PlusIcon = () => <IconSVG d="M12 5v14M5 12h14" />;

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1" icon={UsersIcon} />
        <StatCard title="Total Sessions" value="3" icon={ShoppingCartIcon} />
        <StatCard title="Total Revenue" value="Rs.3700" icon={DollarSignIcon} />
        <StatCard title="Total Stations" value="2" icon={FileTextIcon} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <BellIcon />
                <span className="ml-2">New user registered</span>
              </li>
              <li className="flex items-center">
                <ShoppingCartIcon />
                <span className="ml-2">New order received</span>
              </li>
              <li className="flex items-center">
                <FileTextIcon />
                <span className="ml-2">New report submitted</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <PlusIcon />
              <span className="ml-2">Add New Product</span>
            </Button>
            <Button className="w-full">
              <UsersIcon />
              <span className="ml-2">Manage Users</span>
            </Button>
            <Button className="w-full">
              <FileTextIcon />
              <span className="ml-2">Generate Report</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;