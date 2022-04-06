import ResponsiveAppBar from './composants/Navbar';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Lieux from './pages/Lieux/Lieux';
import SingleLieu from './pages/Lieux/SingleLieu';
import Register from './pages/Login/Register';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
        <Routes>
            <Route  path="/lieu/:id" element={<SingleLieu />} />
            <Route path="/lieux" element={<Lieux />} />
            <Route path="/register" element={<Register />} />
            <Route index path="/" element={<Home />} />
        </Routes>
      <Outlet />
    </div>
  );
}

export default App;
