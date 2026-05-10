import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socketUrl = "http://localhost:4000"

export default function PrinterStatusWidget() {
  const [status, setStatus] = useState("offline")
  const [queueLength, setQueueLength] = useState(0)
  const [lastUpdated, setLastUpdated] = useState("")

  useEffect(() => {
    const socket = io(socketUrl, {
      auth: { admin_token: "true" },
      transports: ["websocket"],
    })

    socket.on("connect", () => {
      console.log("Admin dashboard socket connected")
    })

    socket.on("printer_status_update", (data) => {
      setStatus(data.status ?? "offline")
      setQueueLength(data.queue_length ?? 0)
      setLastUpdated(data.timestamp ? new Date(data.timestamp).toLocaleString() : new Date().toLocaleString())
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div style={{ marginBottom: 20, padding: 14, background: "#111827", color: "#f9fafb", borderRadius: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}>Printer status</div>
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{status}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}>Queue length</div>
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{queueLength}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}>Last update</div>
          <div style={{ marginTop: 8, fontSize: 14 }}>{lastUpdated || 'Waiting...'}</div>
        </div>
      </div>
    </div>
  )
}
