import ResponsiveAppBar from './composants/Navbar';
import React, {useContext, Redirect} from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Lieux from './pages/Lieux/Lieux';
import AddLieu from './pages/Lieux/Add';
import SingleLieu from './pages/Lieux/SingleLieu';
import Register from './pages/Login/Register';
import Login from './pages/Login/Login';
import AuthContext from './Contexts/Auth';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import {authAction} from "./reducer/authReducer";
import ProtectedRoute from './Services/PrivateRoute'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (currentUser) => {
      dispatch(authAction(currentUser));
    });
  }, [])

  const authState = useSelector((state) => state.authReducer)

  return (
    <AuthContext.Provider value={{ isAuthenticated:  (authState) }} >
      <div className="App">
        <ResponsiveAppBar />
          <Routes>
              <Route  path="/lieu/:id" element={<SingleLieu />} />
              <Route path="/lieux" element={<ProtectedRoute><Lieux /></ProtectedRoute>} />
              <Route path="/ajouter-un-lieu" element={<ProtectedRoute><AddLieu /></ProtectedRoute>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route index path="/" element={<Home />} />
          </Routes>
        <Outlet />
      </div>
    </AuthContext.Provider>
  );
}



export default App;
