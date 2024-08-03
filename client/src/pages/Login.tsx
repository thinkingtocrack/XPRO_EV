import Index from "../components/login/Index";
import { useSelector} from "react-redux";
import { RootType } from "../store/configurestore";
import { Navigate } from "react-router-dom";

const Login = () => {
  const isAuth = useSelector((store:RootType)=>store.user.auth.isAuth)
  return (
    <>
      {isAuth?<Navigate to="/home" />:<Index/>}
    </>
  );
};

export default Login;
