import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.js";
import Orders from "./pages/Orders.js";
import Menu from "./pages/Menu.js";
import CustomerMenu from "./pages/CustomerMenu.js";
import TrackOrder from "./pages/TrackOrder.js"; // ⭐ ADD THIS

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/settings" element={<h1>Settings Page</h1>} />
          <Route path="/order" element={<CustomerMenu />} />
          <Route path="/track/:id" element={<TrackOrder />} /> {/* ⭐ ADD THIS */}
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}
