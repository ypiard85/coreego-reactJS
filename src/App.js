import ResponsiveAppBar from './composants/Navbar';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Lieux from './pages/Lieux/Lieux';
import SingleLieu from './pages/Lieux/SingleLieu';
import Register from './pages/Login/Register';
import Login from './pages/Login/Login';
import AuthContext from './Contexts/Auth';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import {authAction} from "./reducer/authReducer";
//https://www.youtube.com/watch?v=l5rUTjUpABg
function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (currentUser) => {
      dispatch(authAction(currentUser));
    });
    console.log(auth.currentUser);

  }, [])

  const authState = useSelector((state) => state.authReducer)

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(authState) }} >
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
    </AuthContext.Provider>
  );
}

export default App;
