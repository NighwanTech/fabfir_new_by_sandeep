import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { HeroService } from '@/modules/hero/hero.service';
import { updateHeroSchema } from '@/modules/hero/hero.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hero = await HeroService.getHeroById(id);
    return successResponse('Hero retrieved successfully', hero);
  } catch (error: any) {
    return errorResponse(error.message, 404);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateHeroSchema.parse(body);
    const updated = await HeroService.updateHero(id, validatedData);
    return successResponse('Hero updated successfully', updated);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const { id } = await params;
    await HeroService.deleteHero(id);
    return successResponse('Hero deleted successfully', null);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
