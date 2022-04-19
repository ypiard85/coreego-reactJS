import {useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({
  children,
}) => {
  const authState = useSelector((state) => state.authReducer)

  if (!authState) {
    return <Navigate to="/login" replace />;
  }
  return children;

};

export default ProtectedRoute