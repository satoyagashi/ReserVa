import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ParkingProvider } from "./components/ParkingContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import Zones from "./pages/Zones";
import Slots from "./pages/Slots";

export default function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/zones" element={<Zones />} />
            <Route path="/slots" element={<Slots />} />
          </Route>
          <Route path="*" element={<h1 style={{ padding: 30 }}>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}