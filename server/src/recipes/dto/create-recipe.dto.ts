import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @IsString({ each: true })
  instructions: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  prepTime?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cookTime?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
