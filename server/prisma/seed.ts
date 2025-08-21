import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with mocked users and recipes...');

  const users = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
    },
    {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      password: 'password123',
    },
    {
      name: 'Diana Prince',
      email: 'diana@example.com',
      password: 'password123',
    },
    {
      name: 'Ethan Clark',
      email: 'ethan@example.com',
      password: 'password123',
    },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, password: hash },
    });

    const sampleRecipes = [
      {
        title: `${u.name.split(' ')[0]}'s Avocado Toast`,
        description: 'Simple and tasty breakfast with avocado and sourdough.',
        ingredients: [
          '2 slices sourdough',
          '1 ripe avocado',
          'salt',
          'pepper',
          'lemon',
        ],
        instructions: [
          'Toast the sourdough until golden.',
          'Mash the avocado with salt, pepper, and a squeeze of lemon.',
          'Spread on toast and serve immediately.',
        ],
        prepTime: 5,
        cookTime: 5,
        servings: 1,
        difficulty: 'Easy',
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1600&auto=format&fit=crop',
      },
      {
        title: `${u.name.split(' ')[0]}'s Pasta Primavera`,
        description: 'Colorful pasta with seasonal vegetables.',
        ingredients: [
          '200g pasta',
          'olive oil',
          'garlic',
          'mixed veggies',
          'parmesan',
        ],
        instructions: [
          'Cook pasta in salted boiling water until al dente.',
          'Sauté garlic and vegetables in olive oil.',
          'Combine with pasta and top with parmesan.',
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        difficulty: 'Medium',
        imageUrl:
          'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1600&auto=format&fit=crop',
      },
      {
        title: `${u.name.split(' ')[0]}'s Berry Smoothie`,
        description: 'Refreshing berry smoothie with yogurt and honey.',
        ingredients: ['1 cup mixed berries', '1/2 cup yogurt', 'honey', 'ice'],
        instructions: [
          'Add all ingredients to blender.',
          'Blend until smooth.',
          'Serve chilled.',
        ],
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        difficulty: 'Easy',
        imageUrl:
          'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1600&auto=format&fit=crop',
      },
    ];

    for (const r of sampleRecipes) {
      await prisma.recipe.create({
        data: {
          ...r,
          authorId: user.id,
        },
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
