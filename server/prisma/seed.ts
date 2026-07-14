import prisma from "../src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // Clean up existing data to prevent duplicate unique constraints
  await prisma.watchHistory.deleteMany({});
  await prisma.watchlistItem.deleteMany({});
  await prisma.user.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  // 1. Seed Users
  const user1 = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@example.com",
      passwordHash: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@example.com",
      passwordHash: passwordHash,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "charlie",
      email: "charlie@example.com",
      passwordHash: passwordHash,
    },
  });

  console.log(`Created users: ${user1.username}, ${user2.username}, ${user3.username}`);

  // 2. Seed Watchlist Items
  const watchlist1 = await prisma.watchlistItem.create({
    data: {
      userId: user1.id,
      tmdbId: 27205, // Inception
      mediaType: "MOVIE",
    },
  });

  const watchlist2 = await prisma.watchlistItem.create({
    data: {
      userId: user1.id,
      tmdbId: 1396, // Breaking Bad
      mediaType: "SERIES",
    },
  });

  const watchlist3 = await prisma.watchlistItem.create({
    data: {
      userId: user2.id,
      tmdbId: 157336, // Interstellar
      mediaType: "MOVIE",
    },
  });

  console.log("Created watchlist items.");

  // 3. Seed Watch History Items
  const history1 = await prisma.watchHistory.create({
    data: {
      userId: user1.id,
      tmdbId: 27205, // Inception
      mediaType: "MOVIE",
    },
  });

  const history2 = await prisma.watchHistory.create({
    data: {
      userId: user2.id,
      tmdbId: 1396, // Breaking Bad
      mediaType: "SERIES",
    },
  });

  console.log("Created watch history items.");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
