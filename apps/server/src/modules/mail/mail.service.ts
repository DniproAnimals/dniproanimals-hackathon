import type { SendTestEmailBody } from "@dniproanimals/contracts";
import { sendMail } from "../../shared/lib/mailer";

const defaultSubject = "DniproAnimals test email";
const defaultText = "This is a test email from DniproAnimals backend.";

export const mailService = {
  async sendTestEmail(payload: SendTestEmailBody) {
    const subject = payload.subject ?? defaultSubject;
    const text = payload.text ?? defaultText;
    await sendMail({
      to: payload.to,
      subject,
      text,
      html: payload.html,
    });
  },
};
