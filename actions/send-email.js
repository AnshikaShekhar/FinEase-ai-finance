// "use server";

// import { Resend } from "resend";

// export async function sendEmail({ to, subject, react }) {
//   const resend = new Resend(process.env.RESEND_API_KEY || "");

//   try {
//     const data = await resend.emails.send({
//       from: "FinEase <onboarding@resend.dev>",
//       to,
//       subject,
//       react,
//     });

//     return { success: true, data };
//   } catch (error) {
//     console.error("Failed to send email:", error);
//     return { success: false, error };
//   }
// }
"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  console.log("=== Starting sendEmail ===");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("React payload:", JSON.stringify(react, null, 2));

  const resend = new Resend(process.env.RESEND_API_KEY || "");
  console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY) {
    const error = "RESEND_API_KEY is missing";
    console.error(error);
    throw new Error(error); // Throw error to fail the Inngest step
  }

  try {
    const data = await resend.emails.send({
      from: "FinEase <onboarding@resend.dev>",
      to,
      subject,
      react,
    });
    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error.message);
    console.error("Error details:", error);
    throw new Error(`Failed to send email: ${error.message}`); // Throw error to fail the Inngest step
  }
}