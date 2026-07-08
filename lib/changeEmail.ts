import { brevo } from "./brevo";
export async function changeEmail(
  email: string,
  userName: string,
  verificationUrl: string
) 
{
    console.log("EMAIL FUNCTION CALLED");
  try {
     console.log("Before Brevo")
    const response =
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL!,
          name: "Volunteer Verification",
        },
        to: [
          {
            email,
            name: userName,
          },
        ],
        subject: "Verify your changed email",
        htmlContent: `
          <html>
            <body>
              <h2>
                Welcome ${userName}
              </h2>
              <p>
                Please click on below link to verify your new Email
              </p>
              <a href="${verificationUrl}">
                Verify new Email
              </a>
            </body>
          </html>
        `,
      });
    console.log("BREVO RESPONSE:", response);
  } catch (error) {
    console.log("BREVO ERROR:", error);
    throw new Error(
      "Failed to send verification email"
    );
  }
}