import axios from 'axios';

export async function sendPushNotification(token, title, body, data = {}) {
  await axios.post('https://fcm.googleapis.com/fcm/send', {
    to: token,
    notification: { title, body },
    data
  }, {
    headers: {
      Authorization: `key=${process.env.FCM_SERVER_KEY}`,
      'Content-Type': 'application/json'
    }
  });
}
