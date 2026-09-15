import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { HeroService } from '@/modules/hero/hero.service';
import { createHeroSchema } from '@/modules/hero/hero.validation';

export async function GET() {
  try {
    const heroes = await HeroService.getAllHeroes();
    return successResponse('Heroes retrieved successfully', heroes);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const body = await request.json();
    const validatedData = createHeroSchema.parse(body);
    const hero = await HeroService.createHero(validatedData);
    return successResponse('Hero created successfully', hero, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
