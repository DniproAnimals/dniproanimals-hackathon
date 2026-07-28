"use client";

import { useEffect, useRef } from "react";

import type { JSONContent } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { EditorToolbar } from "./EditorToolBar";

type Props = {
  value: JSONContent;
  onChange(value: JSONContent): void;
};

export function ContractEditor({ value, onChange }: Props) {
  const hasLoadedInitialContent = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false, // отключаем встроенный Link из StarterKit
        underline: false, // отключаем встроенный Underline из StarterKit
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,

    editorProps: {
      attributes: {
        class:
          "ProseMirror prose prose-neutral max-w-none outline-none min-h-[1056px] w-[210mm] bg-white shadow-xl mx-auto px-[25mm] py-[25mm]",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  // Подтягиваем контент из пропсов ТОЛЬКО один раз — когда с сервера
  // реально пришли данные (contract.content). Дальше редактор — источник правды,
  // и мы больше не дёргаем setContent на каждый onChange/keystroke.
  useEffect(() => {
    if (!editor || hasLoadedInitialContent.current) return;
    if (!value?.content?.length) return; // ещё дефолтный пустой doc

    editor.commands.setContent(value);
    hasLoadedInitialContent.current = true;
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-neutral-200 shadow">
      <EditorToolbar editor={editor} />

      <div className="overflow-auto p-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
