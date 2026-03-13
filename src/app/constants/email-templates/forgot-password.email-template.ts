interface IForgotPasswordEmailTemplateDTO {
  name: string;
  resetPasswordLink: string;
}
export const forgotPasswordEmailTemplate = (
  payload: IForgotPasswordEmailTemplateDTO,
) => {
  const { name, resetPasswordLink } = payload;

  if (!name || !resetPasswordLink) {
    throw new Error(`Email or reset password link is missing`);
  }
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">   
        <h2 style="color: #007BFF;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>    
        <a href="${resetPasswordLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Best regards,<br/>Expenso Team</p>
    </div>
    `;
};
