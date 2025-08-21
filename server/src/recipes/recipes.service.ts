import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RateRecipeDto } from './dto/rate-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto, userId: string) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });
  }

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const recipes = await this.prisma.recipe.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            rating: true,
            review: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recipes.map((recipe) => ({
      ...recipe,
      averageRating:
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            recipe.ratings.length
          : 0,
    }));
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            rating: true,
            review: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return {
      ...recipe,
      averageRating:
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            recipe.ratings.length
          : 0,
    };
  }

  async findUserRecipes(userId: string) {
    const recipes = await this.prisma.recipe.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            rating: true,
            review: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recipes.map((recipe) => ({
      ...recipe,
      averageRating:
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            recipe.ratings.length
          : 0,
    }));
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateRecipeDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    return this.prisma.recipe.delete({
      where: { id },
    });
  }

  async rateRecipe(
    recipeId: string,
    rateRecipeDto: RateRecipeDto,
    userId: string,
  ) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_recipeId: { userId, recipeId },
      },
      select: { updatedAt: true },
    });

    if (existingRating) {
      const now = Date.now();
      const lastUpdated = new Date(existingRating.updatedAt).getTime();
      const secondsSinceUpdate = (now - lastUpdated) / 1000;
      if (secondsSinceUpdate < 30) {
        throw new ForbiddenException(
          `Please wait ${Math.ceil(30 - secondsSinceUpdate)}s before updating your rating again`,
        );
      }
    }

    return this.prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      update: rateRecipeDto,
      create: {
        ...rateRecipeDto,
        userId,
        recipeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
