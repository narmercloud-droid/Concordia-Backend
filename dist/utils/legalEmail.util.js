import { getFrontendBaseUrl } from "./customerOrderUrls.js";
export function formatEuro(amount) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
    }).format(amount);
}
export function legalPageLinksHtml() {
    const base = getFrontendBaseUrl();
    return `
    <p style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:13px;color:#666;line-height:1.7">
      <a href="${base}/impressum" style="color:#1b7340">Impressum</a> ·
      <a href="${base}/agb" style="color:#1b7340">AGB</a> ·
      <a href="${base}/widerruf" style="color:#1b7340">Widerrufsbelehrung</a> ·
      <a href="${base}/datenschutz" style="color:#1b7340">Datenschutz</a>
    </p>
  `;
}
export function orderFromEmail() {
    return (process.env.ORDER_FROM_EMAIL ||
        process.env.CAMPAIGN_FROM_EMAIL ||
        "Concordia Pizza <info@concordiapizza.de>");
}
