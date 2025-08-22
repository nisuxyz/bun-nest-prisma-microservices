import { PrismaClient, Prisma } from "generated/prisma";

const prisma = new PrismaClient();

const postData: Prisma.PostCreateInput[] = [
  {
    title: "Post #1",
    author: "Obi Wan Kenobi",
  },
  {
    title: "Post #2",
    author: "Anakin Skywalker",
  },
  {
    title: "Post #3",
    author: "Yoda",
  },
  {
    title: "Post #4",
    author: "Asohka Tano",
  },
  {
    title: "Post #5",
    author: "Boba Fett",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const p of postData) {
    const post = await prisma.post.create({
      data: p,
    });
    console.log(`Created post with id: ${post.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });