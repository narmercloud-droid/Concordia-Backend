import PDFDocument from "pdfkit";
import { getRevenueReport } from "./revenueReport.service.ts";

type ReportData = Awaited<ReturnType<typeof getRevenueReport>>;

function formatEur(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(iso));
}

export async function buildRevenueReportPdf(report: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const { company } = report;

    doc.fontSize(18).text("Umsatzbericht / Tagesabschluss", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#444").text("Zur Vorlage beim Finanzamt / Steuerberater", {
      align: "center"
    });
    doc.fillColor("#000");
    doc.moveDown(1.5);

    doc.fontSize(12).text(company.name, { continued: false });
    doc.fontSize(10).text(`Inhaber: ${company.owner}`);
    doc.text(company.address);
    doc.text(`USt-IdNr.: ${company.vatId}`);
    doc.text(company.email);
    doc.moveDown(1);

    doc.fontSize(11).text(`Filiale: ${report.branchName} (${report.branchId})`);
    doc.text(`Zeitraum: ${report.periodLabel} (Europe/Berlin)`);
    doc.text(`Erstellt am: ${formatDateTime(report.generatedAt)}`);
    doc.moveDown(1);

    doc.fontSize(13).text("Zusammenfassung", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    const summaryRows: Array<[string, string]> = [
      ["Bestellungen (Umsatz-relevant)", String(report.orderCount)],
      ["Storniert / abgelehnt", String(report.cancelledCount)],
      ["Umsatz brutto", formatEur(report.grossRevenue)],
      ["Rabatte & Gutscheine", formatEur(report.discounts)],
      ["Umsatz netto", formatEur(report.netRevenue)],
      ["Liefergebühren (enthalten)", formatEur(report.deliveryFees)],
      ["Ø Bestellwert", formatEur(report.avgOrderValue)]
    ];
    for (const [label, value] of summaryRows) {
      doc.text(`${label}: ${value}`);
    }
    doc.moveDown(1);

    doc.fontSize(13).text("Nach Erfüllungsart", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Lieferung: ${report.delivery.count} Bestellungen — ${formatEur(report.delivery.revenue)}`);
    doc.text(`Abholung: ${report.pickup.count} Bestellungen — ${formatEur(report.pickup.revenue)}`);
    doc.moveDown(1);

    doc.fontSize(13).text("Zahlungsarten", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    if (report.paymentBreakdown.length === 0) {
      doc.text("Keine Umsätze im Zeitraum.");
    } else {
      for (const row of report.paymentBreakdown) {
        doc.text(`${row.method}: ${row.count}× — ${formatEur(row.total)}`);
      }
    }
    doc.moveDown(1);

    doc.fontSize(13).text("Kundentyp", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(
      `Gastbestellungen: ${report.customerTypeBreakdown.guest.count} — ${formatEur(report.customerTypeBreakdown.guest.total)}`
    );
    doc.text(
      `Registrierte Kunden: ${report.customerTypeBreakdown.registered.count} — ${formatEur(report.customerTypeBreakdown.registered.total)}`
    );
    doc.moveDown(1);

    doc.fontSize(13).text("Neu vs. Stammkunden (Filiale)", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(
      `Erstbesteller: ${report.newReturningBreakdown.newCustomers.count} — ${formatEur(report.newReturningBreakdown.newCustomers.total)}`
    );
    doc.text(
      `Wiederkehrend: ${report.newReturningBreakdown.returningCustomers.count} — ${formatEur(report.newReturningBreakdown.returningCustomers.total)}`
    );
    if (report.newReturningBreakdown.unknown.count > 0) {
      doc.text(
        `Ohne Zuordnung: ${report.newReturningBreakdown.unknown.count} — ${formatEur(report.newReturningBreakdown.unknown.total)}`
      );
    }
    doc.moveDown(1.5);

    doc.fontSize(9).fillColor("#555").text(report.legalNote, { align: "justify" });
    doc.moveDown(0.5);
    doc.text(
      "Hinweis: Dieses Dokument ersetzt keine steuerliche Beratung. Eine detaillierte MwSt.-Aufteilung (7 % / 19 %) ist bei Bedarf über den Steuerberater zu erstellen.",
      { align: "justify" }
    );
    doc.text("Concordia Bestellsystem — automatisch generiert.", { align: "center" });

    doc.end();
  });
}

export async function getRevenueReportPdf(params: Parameters<typeof getRevenueReport>[0]) {
  const report = await getRevenueReport(params);
  const pdf = await buildRevenueReportPdf(report);
  return { report, pdf };
}
