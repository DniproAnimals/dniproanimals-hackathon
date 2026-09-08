import type { ReactNode } from "react";
import { Button, Heading, Section, Text } from "react-email";

type RichTextMark = {
  type?: string;
};

type RichTextNode = {
  type?: string;
  text?: string;
  content?: RichTextNode[];
  marks?: RichTextMark[];
};

interface EmailRichTextProps {
  content: string;
  className: string;
  actionUrl?: string;
}

function parseRichText(content: string): RichTextNode | null {
  try {
    const parsed = JSON.parse(content) as RichTextNode;
    if (parsed.type === "doc" && Array.isArray(parsed.content)) return parsed;
  } catch {}

  return null;
}

function renderInline(node: RichTextNode, key: number): ReactNode {
  if (node.type === "hardBreak") return <br key={key} />;

  let value: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold")
      value = <strong key={`bold-${key}`}>{value}</strong>;
    if (mark.type === "italic") value = <em key={`italic-${key}`}>{value}</em>;
  }

  return value;
}

function renderBlock(
  node: RichTextNode,
  className: string,
  actionUrl: string | undefined,
  key: number,
) {
  if (node.type === "heading") {
    return (
      <Heading
        key={key}
        className="m-0 mb-4 text-center text-3xl font-bold text-[#0c1014]"
      >
        {node.content?.map(renderInline)}
      </Heading>
    );
  }

  if (node.type === "paragraph") {
    return (
      <Text key={key} className={className}>
        {node.content?.map(renderInline)}
      </Text>
    );
  }

  if (node.type === "bulletList" || node.type === "orderedList") {
    const List = node.type === "bulletList" ? "ul" : "ol";
    return (
      <List key={key} style={{ margin: "0 0 16px", paddingLeft: "20px" }}>
        {node.content?.map((item, index) =>
          renderBlock(item, className, actionUrl, index),
        )}
      </List>
    );
  }

  if (node.type === "listItem") {
    return (
      <li key={key}>
        {node.content?.map((item, index) =>
          renderBlock(item, className, actionUrl, index),
        )}
      </li>
    );
  }

  if (node.type === "blockquote") {
    return (
      <Section key={key} className="mb-4 rounded-xl bg-[#eef0d3] px-4 py-4">
        {node.content?.map((item, index) =>
          renderBlock(item, className, actionUrl, index),
        )}
      </Section>
    );
  }

  if (node.type === "emailAction" && actionUrl) {
    return (
      <Section key={key} className="mb-6 text-center">
        <Button
          href={actionUrl}
          className="inline-block rounded-lg bg-[#5b7765] px-5 py-3 font-bold text-white no-underline"
        >
          {node.content?.map(renderInline)}
        </Button>
      </Section>
    );
  }

  return null;
}

export function EmailRichText({
  content,
  className,
  actionUrl,
}: EmailRichTextProps) {
  const richText = parseRichText(content);
  if (!richText) {
    return (
      <Text className={className} style={{ whiteSpace: "pre-line" }}>
        {content}
      </Text>
    );
  }

  return (
    <>
      {(richText.content ?? []).map((node, index) =>
        renderBlock(node, className, actionUrl, index),
      )}
    </>
  );
}
