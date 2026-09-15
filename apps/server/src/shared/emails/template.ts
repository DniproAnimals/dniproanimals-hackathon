import type { EmailTemplate } from "@dniproanimals/contracts";

export type EmailTemplateText = Pick<
  EmailTemplate,
  "subject" | "preview" | "content"
>;

type TemplateVariables = Record<string, string | number>;

function interpolateText(value: string, variables: TemplateVariables) {
  return value.replace(/{{(\w+)}}/g, (placeholder, key: string) => {
    const variable = variables[key];
    return variable === undefined ? placeholder : String(variable);
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function interpolateRichText(
  value: unknown,
  variables: TemplateVariables,
): unknown {
  if (typeof value === "string") return interpolateText(value, variables);
  if (Array.isArray(value)) {
    return value.map((item) => interpolateRichText(item, variables));
  }
  if (!isObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      interpolateRichText(item, variables),
    ]),
  );
}

function interpolate(value: string | null, variables: TemplateVariables) {
  if (!value) return value;

  try {
    const richText = JSON.parse(value) as unknown;
    if (isObject(richText) && richText.type === "doc") {
      return JSON.stringify(interpolateRichText(richText, variables));
    }
  } catch {}

  return interpolateText(value, variables);
}

export function resolveEmailTemplate(
  template: EmailTemplateText,
  variables: TemplateVariables = {},
): EmailTemplateText {
  return {
    subject: interpolate(template.subject, variables)!,
    preview: interpolate(template.preview, variables)!,
    content: interpolate(template.content, variables)!,
  };
}

function getRichTextValue(value: unknown, text: string[]) {
  if (typeof value === "string") {
    text.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => getRichTextValue(item, text));
    return;
  }
  if (!isObject(value)) return;

  if (typeof value.text === "string") text.push(value.text);
  if (Array.isArray(value.content)) {
    value.content.forEach((item) => getRichTextValue(item, text));
  }
}

export function getEmailTemplateText(content: string) {
  try {
    const richText = JSON.parse(content) as unknown;
    if (isObject(richText) && richText.type === "doc") {
      const text: string[] = [];
      getRichTextValue(richText.content, text);
      return text.join("\n");
    }
  } catch {
    // Plain-text templates are expected until the first TipTap save.
  }

  return content;
}
