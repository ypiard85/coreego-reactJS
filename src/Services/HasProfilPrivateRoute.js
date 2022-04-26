import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import {auth} from '../backend/config';


const HasProfilPrivateRoute = ({
  children,
}) => {

    const [userID, setUserID] = useState();

    useEffect(() => {
      if(auth.currentUser){
        setUserID(auth.currentUser.uid)
      }
    })

    const profil = useSelector(state => state.profilReducer)

    const authState = useSelector((state) => state.authReducer)
    const tonavigate = "/profil/"+userID

    if(!authState){
        return <Navigate to="/login" replace />;
    }else if(authState && !profil){
      return <Navigate to={tonavigate} replace />;
    }

  return children;

};

export default HasProfilPrivateRoute