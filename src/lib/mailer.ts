import nodemailer from 'nodemailer';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendAssessmentEmail = async (assessmentData: any) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.warn("EMAIL_USER or EMAIL_APP_PASSWORD not set. Assessment email skipped.");
    return;
  }

  const adminPanelUrl = process.env.ADMIN_PANEL_URL || 'http://localhost:3000';
  const assessmentLink = `${adminPanelUrl}/admin/assessments?id=${assessmentData.id}`;

  const mailOptions = {
    from: `"FabFit Notifications" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Assessment Form: ${assessmentData.firstName} ${assessmentData.lastName}`,
    html: `
      <h2>New Assessment Submitted!</h2>
      <p>A new assessment form has been successfully saved in the database.</p>
      
      <h3>Key Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${assessmentData.firstName} ${assessmentData.lastName}</li>
        <li><strong>Email:</strong> ${assessmentData.email}</li>
        <li><strong>Phone:</strong> ${assessmentData.phone}</li>
        <li><strong>Age:</strong> ${assessmentData.age}</li>
        <li><strong>Primary Goal:</strong> ${assessmentData.primaryGoal}</li>
      </ul>
      
      <br />
      <p>Click the link below to view the full details in the Admin Panel:</p>
      <a href="${assessmentLink}" style="padding: 10px 15px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">View Full Assessment</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Assessment notification email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Failed to send assessment notification email:", error);
  }
};
