import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "cooking",
  "ready",
  "out_for_delivery",
  "delivered",
];

const STATUS_LABELS = {
  pending: "We received your order",
  accepted: "We accepted your order",
  preparing: "We are preparing your meal",
  cooking: "Your food is cooking",
  ready: "Your order is ready",
  out_for_delivery: "Your order is on the way",
  delivered: "Enjoy your meal!",
};

const STATUS_MESSAGES = {
  pending: "We’re just checking everything and getting ready.",
  accepted: "The kitchen has your ticket and is getting started.",
  preparing: "Fresh ingredients, sharp knives, focused chefs.",
  cooking: "Your meal is on the stove, sizzling away.",
  ready: "Packed, sealed, and ready to leave the restaurant.",
  out_for_delivery: "Our driver is heading to you right now.",
  delivered: "Bon appétit! Thank you for ordering with us.",
};

const STATUS_ICONS = {
  pending: "📝",
  accepted: "✅",
  preparing: "👨‍🍳",
  cooking: "🔥",
  ready: "📦",
  out_for_delivery: "🛵",
  delivered: "🍽️",
};

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <div style={styles.page}>
        <style>{pageStyles}</style>
        <div style={styles.loadingText}>Loading your order...</div>
      </div>
    );
  }

  const currentIndex = STATUSES.indexOf(order.status);
  const progress = currentIndex === -1 ? 0 : currentIndex / (STATUSES.length - 1);
  const icon = STATUS_ICONS[order.status] || "🍽️";
  const title = STATUS_LABELS[order.status] || "Tracking your order";
  const message = STATUS_MESSAGES[order.status] || "";

  return (
    <div style={styles.page}>
      <style>{pageStyles}</style>

      <div style={styles.gradientOverlay} />

      <div style={styles.contentWrapper}>
        <div style={styles.topSection}>
          <div style={styles.statusHeader}>
            <div style={styles.statusBadge}>Order #{order.id}</div>
            <h1 style={styles.statusTitle}>{title}</h1>
            <p style={styles.statusMessage}>{message}</p>
          </div>

          <div style={styles.waveContainer}>
            <div className="wave-line" />

            <div style={styles.dotsRow}>
              {STATUSES.map((status, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;
                return (
                  <div key={status} style={styles.dotWrapper}>
                    <div
                      className={`wave-dot ${
                        isActive ? "wave-dot-active" : isPast ? "wave-dot-past" : ""
                      }`}
                    />
                    <span style={styles.dotLabel}>{status.replace(/_/g, " ")}</span>
                  </div>
                );
              })}
            </div>

            <div
              className="wave-icon"
              style={{
                left: `${progress * 100}%`,
              }}
            >
              <div className="wave-icon-inner">{icon}</div>
            </div>
          </div>
        </div>

        <div style={styles.bottomSection}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order details</h2>

            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Name</span>
              <span style={styles.cardValue}>{order.customer_name}</span>
            </div>

            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Phone</span>
              <span style={styles.cardValue}>{order.customer_phone}</span>
            </div>

            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Address</span>
              <span style={styles.cardValue}>{order.customer_address}</span>
            </div>

            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Estimated delivery</span>
              <span style={styles.cardValue}>{order.delivery_time} minutes</span>
            </div>

            <div style={{ marginTop: 20 }}>
              <span style={styles.cardLabel}>Items</span>
              <div style={{ marginTop: 8 }}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <span>
                      {item.qty} × {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>€{order.total_price}</span>
            </div>

            <div style={styles.refreshHint}>
              Updating every 5 seconds · Status: <strong>{order.status}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#0f172a",
    color: "white",
    fontFamily: "system-ui, sans-serif",
  },
  gradientOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(74, 222, 128, 0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.4), transparent 55%)",
    pointerEvents: "none",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px 60px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  statusHeader: {
    textAlign: "left",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(22, 163, 74, 0.2)",
    color: "#bbf7d0",
    fontSize: "12px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  statusTitle: {
    margin: "10px 0 4px",
    fontSize: "28px",
    fontWeight: 700,
  },
  statusMessage: {
    margin: 0,
    fontSize: "14px",
    color: "#e5e7eb",
    maxWidth: "480px",
  },
  waveContainer: {
    position: "relative",
    marginTop: "20px",
    padding: "40px 20px 30px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(6, 95, 70, 0.9))",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
    overflow: "hidden",
  },
  dotsRow: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: "40px",
  },
  dotWrapper: {
    position: "relative",
    textAlign: "center",
    width: "80px",
  },
  dotLabel: {
    marginTop: "8px",
    fontSize: "11px",
    color: "#d1fae5",
    textTransform: "capitalize",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "flex-start",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "20px 22px",
    borderRadius: "20px",
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(148, 163, 184, 0.35)",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(14px)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "14px",
  },
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "6px",
    fontSize: "13px",
  },
  cardLabel: {
    color: "#9ca3af",
    fontSize: "12px",
  },
  cardValue: {
    color: "#e5e7eb",
    fontSize: "13px",
    textAlign: "right",
  },
  itemRow: {
    fontSize: "13px",
    color: "#e5e7eb",
    padding: "2px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "18px",
    paddingTop: "10px",
    borderTop: "1px solid rgba(148, 163, 184, 0.4)",
  },
  totalLabel: {
    fontSize: "13px",
    color: "#9ca3af",
  },
  totalValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#bbf7d0",
  },
  refreshHint: {
    marginTop: "10px",
    fontSize: "11px",
    color: "#9ca3af",
  },
  loadingText: {
    position: "relative",
    zIndex: 1,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e5e7eb",
    fontSize: "16px",
  },
};

const pageStyles = `
.wave-line {
  position: absolute;
  top: 40%;
  left: 4%;
  right: 4%;
  height: 80px;
  background: radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.4), transparent 55%),
              radial-gradient(circle at 50% 0%, rgba(22, 163, 74, 0.5), transparent 55%),
              radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.4), transparent 55%);
  opacity: 0.35;
  filter: blur(10px);
}

.wave-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.7);
  margin: 0 auto;
  position: relative;
}

.wave-dot::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.wave-dot-past {
  background: #4ade80;
}

.wave-dot-active {
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.35);
  animation: pulse-dot 1.4s infinite;
}

.wave-icon {
  position: absolute;
  top: 18%;
  transform: translateX(-50%);
  transition: left 0.6s ease-in-out;
}

.wave-icon-inner {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #bbf7d0, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 12px 30px rgba(22, 163, 74, 0.7);
  animation: float-icon 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

@keyframes float-icon {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -6px); }
}
`;

useEffect(() => {
  const interval = setInterval(() => {
    fetchOrder();
  }, 5000);

  return () => clearInterval(interval);
}, []);


