import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { Post, Prisma } from 'generated/prisma';

const MockPost = (id?: number, overrides?: Partial<Prisma.PostCreateInput>): Post => {
  const now = new Date();
  return {
    id: id ?? 0,
    published: true,
    title: "Mock Post",
    author: "John Doe",
    content: "This is a mock post",
    ...overrides,
    createdAt: new Date(overrides?.createdAt ?? now),
    updatedAt: new Date(overrides?.updatedAt ?? now)
  }
}

describe('AppController', () => {
  let appController: AppController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        PrismaService,
        AppService
      ],
    }).compile();

    prismaService = app.get<PrismaService>(PrismaService);
    appController = app.get<AppController>(AppController);
  });

  // tests should be run w clean/freshly migrated & seeded db
  describe('root', () => {
    it('should return all posts', async () => {
      prismaService.post.findMany = jest.fn().mockReturnValueOnce([
        MockPost(1),
        MockPost(2),
      ]);

      const posts = await appController.getPosts();

      expect(prismaService.post.findMany).toHaveBeenCalled();
      expect(posts.length).toBe(2);
    });

    it('should return a post by id', async () => {
      prismaService.post.findUnique = jest.fn().mockReturnValueOnce(MockPost(1));
      const post = await appController.getPostById('1');
      expect(post).not.toBeNull();
      expect(post!.id).toBe(1);

      prismaService.post.findUnique = jest.fn().mockReturnValueOnce(MockPost(2));
      const post2 = await appController.getPostById('2');
      expect(post2).not.toBeNull();
      expect(post2!.id).toBe(2);
    });

    it("should return null for posts that don't exist", async () => {
      prismaService.post.findUnique = jest.fn().mockReturnValueOnce(null);
      const post = await appController.getPostById('-1');
      expect(post).toBeNull();
    });
  });
});
