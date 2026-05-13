import admin from "firebase-admin";
export class PushService {
    async sendToCustomer(deviceToken, title, body, data = {}) {
        if (!deviceToken)
            return;
        return admin.messaging().send({
            token: deviceToken,
            notification: { title, body },
            data
        });
    }
    async sendToTerminal(deviceToken, event, payload = {}) {
        if (!deviceToken)
            return;
        return admin.messaging().send({
            token: deviceToken,
            data: {
                event,
                ...payload
            }
        });
    }
    async sendToCourier(deviceToken, title, body, data = {}) {
        if (!deviceToken)
            return;
        return admin.messaging().send({
            token: deviceToken,
            notification: { title, body },
            data
        });
    }
}
export const pushService = new PushService();
