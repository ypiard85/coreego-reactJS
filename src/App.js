import ResponsiveAppBar from './composants/Navbar';
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Lieux from './pages/Lieux';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
          <Route path="/lieux" element={<Lieux />} />
          <Route index path="/" element={<Home />} />
      </Routes>
      <Outlet />
    </div>
  );
}

export default App;
