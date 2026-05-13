import admin from "firebase-admin";

export class PushService {
  async sendToCustomer(deviceToken: string, title: string, body: string, data: any = {}): Promise<any> {
    if (!deviceToken) return;

    return admin.messaging().send({
      token: deviceToken,
      notification: { title, body },
      data
    });
  }

  async sendToTerminal(deviceToken: string, event: string, payload: any = {}): Promise<any> {
    if (!deviceToken) return;

    return admin.messaging().send({
      token: deviceToken,
      data: {
        event,
        ...payload
      }
    });
  }

  async sendToCourier(deviceToken: string, title: string, body: string, data: any = {}): Promise<any> {
    if (!deviceToken) return;

    return admin.messaging().send({
      token: deviceToken,
      notification: { title, body },
      data
    });
  }
}

export const pushService = new PushService();
