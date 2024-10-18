import LoginComponent from '../../components/admin/login/Login'
import { RootType } from '../../store/configurestore';
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Login = () => {
  const isAuth = useSelector((store:RootType)=>store.admin.auth.isAuth)
  if(isAuth){
    return <Navigate to="/admin" />
  }
  return (
    <>
      <LoginComponent/>
    </>
  );
};

export default Login;
