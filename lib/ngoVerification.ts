import { brevo } from "./brevo";

export async function sendVerificationEmail(
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
          email: "sinsinati232005@gmail.com",
          name: "ngo Verification",
        },
        to: [
          {
            email,
            name: userName,
          },
        ],
        subject: "Verify your Ngo account",
        htmlContent: `
          <html>
            <body>
             <h2>Welcome ${userName}</h2>
                <p>
                Please verify your email address by clicking the button below.
                </p>
                <p>
                After email verification, your NGO account will be reviewed by our moderators.
                You will be able to access the NGO dashboard once approval is granted.
                </p>
                <a href="${verificationUrl}">
                Verify Email
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