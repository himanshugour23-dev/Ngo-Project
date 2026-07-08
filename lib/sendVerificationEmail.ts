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
          name: "Volunteer Verification",
        },
        to: [
          {
            email,
            name: userName,
          },
        ],
        subject: "Verify your volunteer account",
        htmlContent: `
          <html>
            <body>
              <h2>
                Welcome ${userName}
              </h2>

              <p>
                Thank you for registering as a volunteer.
              </p>

              <p>
                Click below to verify your email:
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