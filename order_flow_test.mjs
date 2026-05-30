import axios from 'axios';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4000';

async function main() {
  try {
    const branchesRes = await axios.get(`${BASE}/api/branches`);
    const branchId = (branchesRes?.data?.value && branchesRes.data.value[0] && branchesRes.data.value[0].id) || 'test-branch-1';

    const menuRes = await axios.get(`${BASE}/api/v1/`);
    const firstCat = Array.isArray(menuRes.data) ? menuRes.data[0] : null;
    const firstItem = firstCat?.menuItems?.[0] || firstCat?.menu_items?.[0] || null;

    if (!firstItem) {
      throw new Error('No menu item found to create order');
    }

    const itemId = firstItem.id;
    const price = firstItem.price ?? firstItem.unit_price ?? 100;

    const payload = {
      branchId,
      items: [
        {
          itemId,
          quantity: 1,
          price
        }
      ],
      paymentMethod: 'cash'
    };

    const createRes = await axios.post(`${BASE}/api/v1/order`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(JSON.stringify({
      branches: branchesRes.data,
      menuSample: firstItem,
      create: createRes.data
    }, null, 2));
  } catch (err) {
    if (err && err.response) {
      console.log(JSON.stringify({
        error: err.response.status,
        data: err.response.data,
        stack: err.stack
      }, null, 2));
    } else {
      console.log(JSON.stringify({ error: err?.message || String(err), stack: err?.stack }, null, 2));
    }
    process.exitCode = 1;
  }
}

main();
