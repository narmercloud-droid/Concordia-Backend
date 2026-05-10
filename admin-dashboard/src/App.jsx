import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import CustomerMenu from "./pages/CustomerMenu";
import TrackOrder from "./pages/TrackOrder"; // ⭐ ADD THIS

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
