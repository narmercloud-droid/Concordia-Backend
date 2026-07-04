import { clientBackendJson } from "./clientBackend.js";
import { getBackendUrl } from "./config.js";

const isBrowser = typeof window !== "undefined";

export const aiClient = {
  sendMessage: async (userId: string, message: string) => {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, message })
    };

    const data = isBrowser
      ? await clientBackendJson<{ reply?: string; metadata?: unknown }>("/ai/message", options)
      : await fetch(`${getBackendUrl()}/ai/message`, options).then(async response => {
          if (!response.ok) {
            throw new Error("Failed to send AI message");
          }
          return response.json();
        });

    return {
      reply: data.reply,
      metadata: data.metadata || null
    };
  }
};
