import { Logger } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { HashHelper } from '../helpers/hash.helper';
import { extendedPrismaClient } from './prisma.extension';

const prisma = extendedPrismaClient;
const logger = new Logger('SEED_METHOD');

const createAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const hashedPassword = await HashHelper.encrypt(password);

  if (!email || !password) {
    logger.error('Admin credentials are not set in environment variables.');
    process.exit(1);
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    logger.warn('Admin user already exists. Skipping creation.');
    return;
  }

  await prisma.user.create({
    data: {
      name: 'Administrator',
      email,
      password: hashedPassword,
      role: $Enums.Role.ADMIN,
      provider: $Enums.Provider.LOCAL,
    },
  });
};

async function main() {
  logger.debug('Seeding...');
  await createAdminUser();
  logger.debug('Seeding finished.');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
