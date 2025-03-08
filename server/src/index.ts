// seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      passwordHash: "hashedpassword", // Use a real hash in production!
      username: "testuser",
    },
  });
  console.log("User created:", user);

  // Create a password reset token for the user
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      token: "unique-token-123",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      userId: user.id,
    },
  });
  console.log("PasswordResetToken created:", passwordResetToken);

  // Create a watch history record for the user
  const watchHistory = await prisma.watchHistory.create({
    data: {
      userId: user.id,
      tmdbId: 123456, // Replace with a valid TMDB id
      progress: 50.5, // Example progress percentage
    },
  });
  console.log("WatchHistory created:", watchHistory);

  // Create a watchlist item for the user
  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: user.id,
      tmdbId: 789012, // Replace with a valid TMDB id
    },
  });
  console.log("WatchlistItem created:", watchlistItem);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
