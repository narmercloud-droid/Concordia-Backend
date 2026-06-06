import logger from "../logger.ts";

export async function sendMagicLink(email: string, token: string, callbackPath = "/auth/callback") {
  const frontendBase = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  const link = `${frontendBase}${callbackPath}?token=${token}`;
  const renderBody = `
    <p>Hello,</p>
    <p>Click the link below to sign into Concordia:</p>
    <p><a href="${link}">Sign in with magic link</a></p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    logger.warn({ email, link }, "MagicLink disabled: RESEND_API_KEY not set");
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "magic@concordia.app",
      to: email,
      subject: "Your Concordia login link",
      html: renderBody
    })
  });
}
