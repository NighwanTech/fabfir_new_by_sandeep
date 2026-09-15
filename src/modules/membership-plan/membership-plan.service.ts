import { PlanStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export class MembershipPlanService {
  /**
   * Retrieves all membership plans, optionally filtering by status.
   * Includes ordered features.
   */
  async getPlans(status?: PlanStatus) {
    const where = status ? { status, deletedAt: null } : { deletedAt: null };
    return prisma.membershipPlan.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        features: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  /**
   * Retrieves a single membership plan by ID.
   */
  async getPlanById(id: string) {
    return prisma.membershipPlan.findUnique({
      where: { id, deletedAt: null },
      include: {
        features: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  /**
   * Safe logic to reset other popular plans if this one is popular.
   */
  private async handlePopularStatus(isPopular: boolean, planId?: string) {
    if (isPopular) {
      const where = planId ? { id: { not: planId } } : {};
      await prisma.membershipPlan.updateMany({
        where,
        data: { isPopular: false },
      });
    }
  }

  /**
   * Creates a new membership plan, transactionally inserting its features.
   */
  async createPlan(data: any) {
    const { features = [], ...planData } = data;

    return prisma.$transaction(async (tx) => {
      // If this plan is marked as popular, remove popular status from others
      if (planData.isPopular) {
        await tx.membershipPlan.updateMany({
          where: {},
          data: { isPopular: false },
        });
      }

      // Create the plan
      const plan = await tx.membershipPlan.create({
        data: {
          ...planData,
          features: {
            create: features.map((f: any) => ({
              title: f.title,
              icon: f.icon,
              status: f.status,
              displayOrder: f.displayOrder,
            })),
          },
        },
        include: { features: true },
      });

      return plan;
    });
  }

  /**
   * Updates a membership plan and transactionally syncs its features.
   */
  async updatePlan(id: string, data: any) {
    const { features, ...planData } = data;

    return prisma.$transaction(async (tx) => {
      // Check if plan exists
      const existingPlan = await tx.membershipPlan.findUnique({
        where: { id, deletedAt: null },
      });
      if (!existingPlan) throw new Error('Plan not found');

      // Handle isPopular toggle safely
      if (planData.isPopular === true) {
        await tx.membershipPlan.updateMany({
          where: { id: { not: id } },
          data: { isPopular: false },
        });
      }

      // Update plan details
      const updatedPlan = await tx.membershipPlan.update({
        where: { id },
        data: planData,
      });

      // Synchronize features if provided
      if (features) {
        const featureIdsToKeep = features
          .filter((f: any) => f.id)
          .map((f: any) => f.id);

        // Soft delete features that were removed
        await tx.membershipPlanFeature.updateMany({
          where: {
            planId: id,
            id: { notIn: featureIdsToKeep },
            deletedAt: null,
          },
          data: { deletedAt: new Date() },
        });

        // Upsert features
        for (const feature of features) {
          if (feature.id) {
            // Update existing
            await tx.membershipPlanFeature.update({
              where: { id: feature.id },
              data: {
                title: feature.title,
                icon: feature.icon,
                status: feature.status,
                displayOrder: feature.displayOrder,
              },
            });
          } else {
            // Create new
            await tx.membershipPlanFeature.create({
              data: {
                planId: id,
                title: feature.title,
                icon: feature.icon,
                status: feature.status,
                displayOrder: feature.displayOrder,
              },
            });
          }
        }
      }

      return tx.membershipPlan.findUnique({
        where: { id },
        include: {
          features: {
            where: { deletedAt: null },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
    });
  }

  /**
   * Soft deletes a membership plan and its features.
   */
  async deletePlan(id: string) {
    return prisma.$transaction(async (tx) => {
      const deletedAt = new Date();
      await tx.membershipPlanFeature.updateMany({
        where: { planId: id, deletedAt: null },
        data: { deletedAt },
      });
      return tx.membershipPlan.update({
        where: { id },
        data: { deletedAt },
      });
    });
  }

  // Individual Feature Endpoints (for future flexibility as requested)

  async getFeaturesByPlanId(planId: string) {
    return prisma.membershipPlanFeature.findMany({
      where: { planId, deletedAt: null },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createFeature(planId: string, data: any) {
    return prisma.membershipPlanFeature.create({
      data: {
        planId,
        ...data,
      },
    });
  }

  async updateFeature(planId: string, featureId: string, data: any) {
    const existing = await prisma.membershipPlanFeature.findFirst({
      where: { id: featureId, planId, deletedAt: null },
    });
    if (!existing) throw new Error('Feature not found in this plan');

    return prisma.membershipPlanFeature.update({
      where: { id: featureId },
      data,
    });
  }

  async deleteFeature(planId: string, featureId: string) {
    const existing = await prisma.membershipPlanFeature.findFirst({
      where: { id: featureId, planId, deletedAt: null },
    });
    if (!existing) throw new Error('Feature not found in this plan');

    return prisma.membershipPlanFeature.update({
      where: { id: featureId },
      data: { deletedAt: new Date() },
    });
  }
}
