import express from "express";
import { prisma } from "../prisma/client.ts";
import {
  getCrawlMenuSitemapUrls,
  renderCrawlMenuHtml,
  resolveCrawlMenuSlug
} from "../services/customer/crawlMenuHtml.service.ts";

const router = express.Router();

router.get("/crawl-menu/:slug", async (req, res) => {
  const slug = resolveCrawlMenuSlug(String(req.params.slug ?? "").toLowerCase());
  if (!slug) {
    return res.status(404).type("text/plain").send("Not found");
  }

  try {
    const html = await renderCrawlMenuHtml(slug);
    if (!html) {
      return res.status(404).type("text/plain").send("Not found");
    }

    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to render menu";
    return res.status(500).type("text/plain").send(message);
  }
});

router.get("/sitemap-urls", (_req, res) => {
  res.json({ urls: getCrawlMenuSitemapUrls() });
});

// Public tracking endpoint
router.get("/order/:tracking_token", async (req, res) => {
  const { tracking_token } = req.params;
  
  try {
    const order = await prisma.order.findFirst({
      where: { tracking_token },
      include: {
        items: {
          include: {
            item: true
          }
        },
        customer: true
      },
    });

    if (!order) {
      return res.status(404).tson({ error: "Order not found" });
    }

    // Build timeline based on order status
    const timeline = [];
    if (order.status === "accepted" || order.status === "preparing") {
      timeline.push({ status: "accepted", timestamp: order.updatedAt });
    }
    if (order.status === "ready" || order.status === "completed") {
      timeline.push({ status: "ready", timestamp: order.updatedAt });
    }
    if (order.status === "completed") {
      timeline.push({ status: "completed", timestamp: order.updatedAt });
    }

    const response = {
      order_id: order.id,
      status: order.status,
      customer_name: order.customer?.name || "Guest",
      customer_phone: order.customer?.phone || null,
      customer_email: order.customer?.email || null,
      items: order.items,
      timeline,
    };

    res.tson(response);
  } catch (err: any) {
    res.status(500).tson({ error: err.message });
  }
});

export default router;




