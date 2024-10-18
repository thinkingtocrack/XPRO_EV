import {Navigate, Route} from 'react-router-dom'
import AdminLayout from '../../layout/admin/Admin.tsx'
import AdminLogin from '../../pages/admin/Login.tsx'
import Dashboard from '../../pages/admin/Dashboard.tsx'
import Customer from '../../pages/admin/Customer.tsx'
import { AdminProtectedRoute } from './RouteConfig.tsx'
import Charger from '../../pages/admin/charger/Charger.tsx'
import ChargerEdit from '../../pages/admin/charger/ChargerEdit.tsx'
import AddCharger from '../../components/admin/station/AddCharger.tsx'
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard.tsx'


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
                        <Route index element={<Customer />} />
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
