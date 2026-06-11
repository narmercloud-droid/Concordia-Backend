import fs from "fs/promises";
import path from "path";
import { s3 } from "./s3.js";
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
function extForMime(mime) {
    if (mime === "image/png")
        return "png";
    if (mime === "image/webp")
        return "webp";
    if (mime === "image/gif")
        return "gif";
    return "jpg";
}
export function isS3Configured() {
    return Boolean(process.env.S3_BUCKET &&
        process.env.S3_ACCESS_KEY &&
        process.env.S3_SECRET_KEY &&
        process.env.S3_REGION);
}
export function publicBaseUrl(req) {
    if (process.env.BACKEND_PUBLIC_URL)
        return process.env.BACKEND_PUBLIC_URL.replace(/\/$/, "");
    if (process.env.RENDER_EXTERNAL_URL)
        return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
    if (req)
        return `${req.protocol}://${req.get("host")}`;
    return `http://localhost:${process.env.PORT ?? "4000"}`;
}
async function uploadToS3(buffer, mime, branchId, menuItemId) {
    const bucket = process.env.S3_BUCKET;
    const ext = extForMime(mime);
    const key = `menu/${branchId}/${menuItemId}-${Date.now()}.${ext}`;
    await s3
        .upload({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mime,
        ACL: "public-read"
    })
        .promise();
    const region = process.env.S3_REGION;
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
async function uploadToDisk(buffer, mime, branchId, menuItemId, req) {
    const ext = extForMime(mime);
    const dir = path.join(process.cwd(), "uploads", "menu", branchId);
    await fs.mkdir(dir, { recursive: true });
    const filename = `${menuItemId}-${Date.now()}.${ext}`;
    const fullPath = path.join(dir, filename);
    await fs.writeFile(fullPath, buffer);
    return `${publicBaseUrl(req)}/uploads/menu/${branchId}/${filename}`;
}
export async function storeMenuItemImage(file, branchId, menuItemId, req) {
    if (!file?.buffer?.length)
        throw new Error("No image file provided");
    if (!ALLOWED_MIME.has(file.mimetype)) {
        throw new Error("Only JPEG, PNG, WebP or GIF images are allowed");
    }
    if (file.size > 5 * 1024 * 1024)
        throw new Error("Image must be 5 MB or smaller");
    if (isS3Configured()) {
        return uploadToS3(file.buffer, file.mimetype, branchId, menuItemId);
    }
    return uploadToDisk(file.buffer, file.mimetype, branchId, menuItemId, req);
}
