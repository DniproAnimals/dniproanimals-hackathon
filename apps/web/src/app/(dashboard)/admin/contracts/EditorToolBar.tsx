"use client";

import type { Editor } from "@tiptap/react";

import { Button } from "@dniproanimals/ui";

type Props = {
  editor: Editor;
};

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center gap-1 rounded-t-xl border-b bg-white px-3 py-2 shadow-sm">
      {/* text */}

      <Button
        size="sm"
        variant={editor.isActive("bold") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("italic") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("underline") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </Button>

      <div className="mx-2 h-6 w-px bg-border" />

      {/* headings */}

      <Button
        size="sm"
        variant={editor.isActive("heading", { level: 1 }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("heading", { level: 2 }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("heading", { level: 3 }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </Button>

      <div className="mx-2 h-6 w-px bg-border" />

      {/* lists */}

      <Button
        size="sm"
        variant={editor.isActive("bulletList") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </Button>

      <Button
        size="sm"
        variant={editor.isActive("orderedList") ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </Button>

      <div className="mx-2 h-6 w-px bg-border" />

      {/* align */}

      <Button
        size="sm"
        variant={editor.isActive({ textAlign: "left" }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        L
      </Button>

      <Button
        size="sm"
        variant={editor.isActive({ textAlign: "center" }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        C
      </Button>

      <Button
        size="sm"
        variant={editor.isActive({ textAlign: "right" }) ? "primary" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        R
      </Button>

      <div className="mx-2 h-6 w-px bg-border" />

      {/* undo */}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </Button>
    </div>
  );
}
