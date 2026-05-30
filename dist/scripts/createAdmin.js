import { prisma } from '../prisma/client.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
async function main() {
    const email = "admin@example.com";
    const password = "Concordia@Kempen";
    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.adminUser.create({
        data: {
            id: randomUUID(),
            email,
            password: hashed,
            role: "admin",
            updatedAt: new Date()
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
