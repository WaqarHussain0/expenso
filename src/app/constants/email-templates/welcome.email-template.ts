interface IWelcomeEmailTemplateDTO {
  name: string;
  loginPageLink: string;
}
export const welcomeEmailTemplate = (payload: IWelcomeEmailTemplateDTO) => {
  const { name, loginPageLink } = payload;

  if (!name || !loginPageLink) {
    throw new Error(`Name or login url is missing`);
  }
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">   
        <p>Hi ${name},</p> <p> Your account has been successfully created. We're excited to have you on board! </p> <p> Expenso helps you track your income, expenses, and investments in one place so you can stay in control of your finances. </p> <a href="${loginPageLink}" style=" display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px; " > Go to Dashboard </a> <p style="margin-top: 20px;"> If you have any questions, feel free to reach out. </p> <p> Best regards,<br/> <strong>Expenso Team</strong> </p>
    </div>
    `;
};
