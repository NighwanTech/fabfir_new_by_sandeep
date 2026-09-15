import prisma from '@/lib/prisma';
import { AssessmentStatus } from '@prisma/client';

export class AssessmentService {
  static async createAssessment(data: any) {
    return await prisma.assessment.create({
      data: {
        ...data,
        status: AssessmentStatus.NEW
      }
    });
  }

  static async getAllAssessments() {
    return await prisma.assessment.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getAssessmentById(id: string) {
    const assessment = await prisma.assessment.findFirst({
      where: { id, deletedAt: null }
    });
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    return assessment;
  }

  static async updateAssessment(id: string, data: { status?: AssessmentStatus, notes?: string }) {
    // Ensure it exists and is not deleted
    await this.getAssessmentById(id);
    
    return await prisma.assessment.update({
      where: { id },
      data
    });
  }

  static async deleteAssessment(id: string) {
    // Ensure it exists and is not deleted
    await this.getAssessmentById(id);

    return await prisma.assessment.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  static async bulkDeleteAssessments(ids: string[]) {
    return await prisma.assessment.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() }
    });
  }
}
