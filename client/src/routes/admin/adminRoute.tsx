import {Navigate, Route} from 'react-router-dom'
import { lazy,Suspense } from 'react'
import AdminLayout from '../../layout/admin/Admin.tsx'
const Customer = lazy(()=>import('../../pages/admin/Customer.tsx'))
// import Customer from '../../pages/admin/Customer.tsx'
import { AdminProtectedRoute } from './RouteConfig.tsx'
import Charger from '../../pages/admin/charger/Charger.tsx'
import ChargerEdit from '../../pages/admin/charger/ChargerEdit.tsx'
import AddCharger from '../../components/admin/station/AddCharger.tsx'
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard.tsx'



const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );



const AdminRoute = (
    <>
        <Route path="/admin" >
            <Route index element={<Navigate to='dashboard' />} />
            <Route path="login" lazy={()=>import('../../pages/admin/Login.tsx').then(module=>({
                Component:module.default
            }))}  />
            <Route element={<AdminProtectedRoute/>}>
                <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="customer" >
                        <Route index element={<Suspense fallback={<LoadingSpinner/>} ><Customer/></Suspense>} />
                    </Route>
                    <Route path="charger" >
                        <Route index element={<Charger />} />
                        <Route path='edit/:id' element={<ChargerEdit/>} />
                        <Route path='addcharger' element={<AddCharger/>} />
                    </Route>
                </Route>
            </Route>
        </Route>
    </>
)

export default AdminRoute;
