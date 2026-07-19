import { brevo } from "./brevo";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  taskDescription: string
) {
  console.log("TASK ASSIGNMENT EMAIL FUNCTION CALLED");

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: "sinsinati232005@gmail.com",
        name: "ngoSupport",
      },

      to: [{
          email,
          name: userName,
        },
      ],

      subject:
        "You have been assigned a new volunteer task",

      htmlContent: `
        <html>
          <body>
            <h2>Hello ${userName},</h2>

            <p>
              Congratulations! An NGO has assigned you
              a new community task.
            </p>

            <p>
              <strong>Task:</strong>
              ${taskDescription}
            </p>

            <p>
              Please sign in to your volunteer dashboard
              to view the assigned need and its details.
              You can also use the NGO contact information
              available there to coordinate with them.
            </p>

            <p>
              Thank you for volunteering!
            </p>
          </body>
        </html>
      `,
    });

    console.log(
      "Task assignment email sent to:",
      email
    );

  } catch (error) {
    console.error(
      "BREVO EMAIL ERROR:",
      error
    );

    throw new Error(
      "Failed to send task assignment email"
    );
  }
}