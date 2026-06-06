const AI_BASE_URL = "http://localhost:3001";

export const aiClient = {
  sendMessage: async (userId: string, message: string) => {
    const response = await fetch(`${AI_BASE_URL}/ai/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, message })
    });

    if (!response.ok) {
      throw new Error("Failed to send AI message");
    }

    const data = await response.json();
    return {
      reply: data.reply,
      metadata: data.metadata || null
    };
  }
};
