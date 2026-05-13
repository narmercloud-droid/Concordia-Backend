import axios from "axios";

const MESSAGEBIRD_API_KEY = process.env.MESSAGEBIRD_API_KEY || "";

export class SMSService {
  async sendSMS(phone: string, message: string): Promise<any> {
    if (!phone) return;

    return axios.post(
      "https://rest.messagebird.com/messages",
      {
        recipients: [phone],
        originator: "Concordia",
        body: message
      },
      {
        headers: {
          Authorization: `AccessKey ${MESSAGEBIRD_API_KEY}`
        }
      }
    );
  }

  async sendBulkSMS(phones: string[], message: string): Promise<void> {
    for (const phone of phones) {
      await this.sendSMS(phone, message);
    }
  }
}

export const smsService = new SMSService();
