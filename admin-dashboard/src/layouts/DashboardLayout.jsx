import Sidebar from "../components/Sidebar.js";
import PrinterStatusWidget from "../components/PrinterStatusWidget.js";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
        <PrinterStatusWidget />
        {children}
      </div>
    </div>
  );
}
