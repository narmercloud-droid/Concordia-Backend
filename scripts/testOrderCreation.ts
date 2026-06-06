import axios from "axios";

async function test() {
  try {
    const response = await axios.post("http://localhost:4000/api/v1/order", {
      branchId: "branch-001",        // must exist or be nullable in DB
      customerId: "test-customer",   // must exist or be nullable in DB
      paymentMethod: "cash",
      status: "pending",

      items: [
        {
          itemId: 2,          // <-- your real MenuItem ID
          quantity: 1,
          price: 10,
          variantId: "default"   // <-- MUST be a string
        }
      ]
    });

    console.log("Order creation response:", response.data);
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
}

test();
