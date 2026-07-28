import type { ContractTemplateResponse } from "../modules/contract-templates";

type Props = {
  contract: ContractTemplateResponse;
};

function render(nodes: any[]): React.ReactNode {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "heading":
        if (node.attrs.level === 1)
          return <h1 key={index}>{render(node.content ?? [])}</h1>;

        if (node.attrs.level === 2)
          return <h2 key={index}>{render(node.content ?? [])}</h2>;

        return <h3 key={index}>{render(node.content ?? [])}</h3>;

      case "paragraph":
        return <p key={index}>{render(node.content ?? [])}</p>;

      case "bulletList":
        return <ul key={index}>{render(node.content ?? [])}</ul>;

      case "orderedList":
        return <ol key={index}>{render(node.content ?? [])}</ol>;

      case "listItem":
        return <li key={index}>{render(node.content ?? [])}</li>;

      case "text":
        return node.text;

      default:
        return null;
    }
  });
}

export function ContractDocumentView({ contract }: Props) {
  return (
    <article className="prose max-w-none">
      {render(contract.content.content ?? [])}
    </article>
  );
}
