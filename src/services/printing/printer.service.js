import axios from 'axios';

export async function sendToPrinter(branch, payload) {
  if (!branch.printerUrl) {
    console.error('Branch has no printer URL configured');
    return;
  }

  try {
    await axios.post(branch.printerUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Printer error:', error.message);
  }
}
