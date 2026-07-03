import dotenv from "dotenv";
import { autoCompleteStaleOrders } from "../src/services/order/endOfDayOrderCleanup.service.ts";

dotenv.config();

const result = await autoCompleteStaleOrders();
console.log(result);
