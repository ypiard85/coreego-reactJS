import {useContext, Redirect} from "react";
import { Route } from "react-router";
import Auth from '../Contexts/Auth';

const PrivateRoute = ({path, element}) => {
    const {isAuthenticated} = useContext(Auth);

    return isAuthenticated ? (
        <Route path={path} element={element} />
    ) : (
        <Redirect to="/login" />
    )

}

export default PrivateRoute