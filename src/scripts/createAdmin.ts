import prisma from '../prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = "admin@example.com";
  const password = "Concordia@Kempen";

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.create({
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
