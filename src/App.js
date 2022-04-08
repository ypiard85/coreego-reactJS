import ResponsiveAppBar from './composants/Navbar';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Lieux from './pages/Lieux/Lieux';
import SingleLieu from './pages/Lieux/SingleLieu';
import Register from './pages/Login/Register';
import Login from './pages/Login/Login';
import { useState } from 'react';
import {hasAuthenticated} from './Services/AuthApi';
import Auth from './Contexts/Auth';
import PrivateRoute from './composants/PrivateRoute'
//https://www.youtube.com/watch?v=l5rUTjUpABg
function App() {

  const [isAuth, setIsAuth] = useState(hasAuthenticated());

  return (
      <Auth.Provider value={{ isAuth }} >
    <div className="App">
      <ResponsiveAppBar />
        <Routes>
            <Route  path="/lieu/:id" element={<SingleLieu />} />
            <Route path="/lieux" element={<Lieux/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route index path="/" element={<Home />} />
        </Routes>
      <Outlet />
    </div>
      </Auth.Provider>
  );
}

export default App;
