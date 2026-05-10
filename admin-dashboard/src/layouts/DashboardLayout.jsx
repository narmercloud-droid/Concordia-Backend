import Sidebar from "../components/Sidebar";
import PrinterStatusWidget from "../components/PrinterStatusWidget";

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
