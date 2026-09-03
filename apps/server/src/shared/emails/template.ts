import type { EmailTemplate } from "@dniproanimals/contracts";

export type EmailTemplateText = Pick<
  EmailTemplate,
  | "subject"
  | "preview"
  | "heading"
  | "message"
  | "actionLabel"
  | "secondaryMessage"
  | "footer"
>;

type TemplateVariables = Record<string, string | number>;

function interpolate(value: string | null, variables: TemplateVariables) {
  if (!value) return value;

  return value.replace(/{{(\w+)}}/g, (placeholder, key: string) => {
    const variable = variables[key];
    return variable === undefined ? placeholder : String(variable);
  });
}

export function resolveEmailTemplate(
  template: EmailTemplateText,
  variables: TemplateVariables = {},
): EmailTemplateText {
  return {
    subject: interpolate(template.subject, variables)!,
    preview: interpolate(template.preview, variables)!,
    heading: interpolate(template.heading, variables)!,
    message: interpolate(template.message, variables)!,
    actionLabel: interpolate(template.actionLabel, variables),
    secondaryMessage: interpolate(template.secondaryMessage, variables),
    footer: interpolate(template.footer, variables)!,
  };
}
