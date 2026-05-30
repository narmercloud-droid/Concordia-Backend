import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import sunmiRoutes from "./routes/sunmi.js";
import authRoutes from "./routes/auth.js";
import courierRoutes from "./routes/courier.js";
import marketingRoutes from "./routes/marketing.js";
import campaignRoutes from "./routes/campaigns.js";
import kdsRoutes from "./routes/kds.js";
import trackRoutes from "./routes/track.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/sunmi", sunmiRoutes);
app.use("/auth", authRoutes);
app.use("/courier", courierRoutes);
app.use("/customer", marketingRoutes);
app.use("/admin", campaignRoutes);
app.use("/kds", kdsRoutes);
app.use(trackRoutes);

export default app;

