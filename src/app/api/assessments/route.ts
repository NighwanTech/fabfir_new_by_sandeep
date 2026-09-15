import { NextRequest } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { AssessmentService } from '@/modules/assessment/assessment.service';
import { createAssessmentSchema } from '@/modules/assessment/assessment.validation';
import { sendAssessmentEmail } from '@/lib/mailer';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const assessments = await AssessmentService.getAllAssessments();
    return successResponse('Assessments retrieved successfully', assessments);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

async function uploadFileToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'fabfit_assessments', resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key !== 'physiqueImage' && key !== 'bloodReport') {
          data[key] = value;
        }
      }

      const physiqueFile = formData.get('physiqueImage') as File | null;
      if (physiqueFile && physiqueFile.size > 0) {
        try {
          data.physiqueImageUrl = await uploadFileToCloudinary(physiqueFile);
        } catch (e) {
          console.error('Failed to upload physique image:', e);
        }
      }

      const bloodFile = formData.get('bloodReport') as File | null;
      if (bloodFile && bloodFile.size > 0) {
        try {
          data.bloodReportUrl = await uploadFileToCloudinary(bloodFile);
        } catch (e) {
          console.error('Failed to upload blood report:', e);
        }
      }
    } else {
      data = await request.json();
    }

    const validatedData = createAssessmentSchema.parse(data);
    const newAssessment = await AssessmentService.createAssessment(validatedData);

    sendAssessmentEmail(newAssessment).catch(console.error);

    return successResponse('Application submitted successfully!', newAssessment, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400, error.errors);
    }
    return errorResponse(error.message || 'Error submitting assessment', 500);
  }
}
