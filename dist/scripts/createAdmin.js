"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const email = "admin@example.com";
    const password = "Concordia@Kempen";
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const admin = await prisma_1.default.adminUser.create({
        data: {
            email,
            password: hashed,
        },
    });
    console.log("Admin created:", admin);
}
main()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
