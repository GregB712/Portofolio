import { Resend } from "resend";
import type { ContactInput } from "@/lib/validations";

export async function forwardContactEmail(input: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true };

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || "gregorybarbas@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const sentAt = new Date().toISOString();

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>New portfolio contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(input.company || "Not provided")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
      <p><strong>Source:</strong> ${escapeHtml(input.sourcePage || "Unknown")}</p>
      <p><strong>Date:</strong> ${sentAt}</p>
      <hr />
      <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Portfolio contact: ${input.subject}`,
    html
  });

  if (error) throw new Error(error.message);
  return { skipped: false };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
