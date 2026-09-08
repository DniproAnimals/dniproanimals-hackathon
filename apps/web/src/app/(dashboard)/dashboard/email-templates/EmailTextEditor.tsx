"use client";

import { Button } from "@dniproanimals/ui";
import { mergeAttributes, Node, type JSONContent } from "@tiptap/core";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EmailTextEditorProps {
  value: string;
  hasAction: boolean;
  onChange(value: string): void;
}

const EmailAction = Node.create({
  name: "emailAction",
  group: "block",
  content: "inline*",
  defining: true,
  parseHTML() {
    return [{ tag: "email-action" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "email-action",
      mergeAttributes(HTMLAttributes, {
        class:
          "block rounded-lg bg-primary px-4 py-2 text-center font-bold text-primary-foreground",
      }),
      0,
    ];
  },
});

function getEditorContent(value: string): JSONContent | string {
  try {
    const content = JSON.parse(value) as JSONContent;
    return content.type === "doc" ? content : value;
  } catch {
    return value;
  }
}

function EditorToolbar({
  editor,
  hasAction,
}: {
  editor: Editor;
  hasAction: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-border bg-muted p-2">
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("heading", { level: 2 }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        Заголовок
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bulletList") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Список
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("orderedList") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. Список
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("blockquote") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Примітка
      </Button>
      {hasAction ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "emailAction",
                content: [{ type: "text", text: "Текст кнопки" }],
              })
              .run()
          }
        >
          Кнопка
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
      >
        Скасувати
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
      >
        Повторити
      </Button>
    </div>
  );
}

export function EmailTextEditor({
  value,
  hasAction,
  onChange,
}: EmailTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
      EmailAction,
    ],
    content: getEditorContent(value),
    editorProps: {
      attributes: {
        class:
          "ProseMirror min-h-36 rounded-b-xl bg-gray-light px-4 py-3 text-sm text-foreground outline-none [&_p]:m-0 [&_p+p]:mt-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.isEmpty ? "" : JSON.stringify(editor.getJSON()));
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-border">
      <EditorToolbar editor={editor} hasAction={hasAction} />
      <EditorContent editor={editor} />
    </div>
  );
}
