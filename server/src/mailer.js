import nodemailer from "nodemailer";

/**
 * Returns a mailer when SMTP_HOST is configured, otherwise null (email disabled).
 * Contact-form submissions are always stored in the database regardless.
 */
export function createMailer(env = process.env) {
  const host = (env.SMTP_HOST || "").trim();
  if (!host) return null;

  const to = (env.CONTACT_TO || "").trim();
  if (!to) throw new Error("CONTACT_TO must be set when SMTP_HOST is configured");

  const port = Number(env.SMTP_PORT || 587);
  const from = (env.CONTACT_FROM || env.SMTP_USER || to).trim();
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: env.SMTP_SECURE === "true" || port === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS || "" } : undefined,
  });

  return {
    async sendContactNotification(msg) {
      await transport.sendMail({
        from,
        to,
        replyTo: { name: msg.name, address: msg.email },
        subject: `[binoy.co] New message from ${msg.name}`,
        text: [
          `Name:    ${msg.name}`,
          `Email:   ${msg.email}`,
          `IP:      ${msg.ip ?? "n/a"}`,
          `Message: #${msg.id ?? "?"}`,
          "",
          msg.message,
        ].join("\n"),
      });
    },
    verify() {
      return transport.verify();
    },
  };
}
