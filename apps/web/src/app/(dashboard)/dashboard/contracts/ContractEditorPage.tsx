"use client";

import type { JSONContent } from "@tiptap/core";
import { useState } from "react";

import { Button } from "@dniproanimals/ui";

import { useUpdateContractTemplateMutation } from "@/shared/query-hooks/mutations/useUpdateContractTemplateMutation";
import { useContractTemplateQuery } from "@/shared/query-hooks/queries/useContractTemplateQuery";
import { ContractEditor } from "./ContractEditor";

export function ContractEditorPage() {
  const type = "adoption";
  const { data: contract, isLoading } = useContractTemplateQuery(type);
  const updateMutation = useUpdateContractTemplateMutation(type);
  const [editedContent, setEditedContent] = useState<JSONContent>();

  if (isLoading || !contract) {
    return <div>Завантаження...</div>;
  }

  const currentContract = contract;
  const content = editedContent ?? currentContract.content;

  async function handleSave() {
    await updateMutation.mutateAsync({
      title: currentContract.title,
      subtitle: currentContract.subtitle,
      content,
    });
  }

  return (
    <div className="space-y-6">
      <ContractEditor value={content} onChange={setEditedContent} />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Збереження..." : "Зберегти"}
        </Button>
      </div>
    </div>
  );
}
