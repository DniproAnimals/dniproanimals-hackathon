type NeedButtonProps = {
  label: string;
  price?: string;
};

function NeedButton({ label, price }: NeedButtonProps) {
  return (
    <button
      type="button"
      className="flex max-w-full shrink-0 items-center gap-2 rounded-full border border-solid border-neutral-100 bg-[#FAF5FE] px-3.25 py-1.75 text-left transition-colors hover:bg-[#F3EAFE]"
    >
      <span className="wrap-break-word text-sm text-[#354152]">{label}</span>

      {price && (
        <span className="shrink-0 text-xs font-bold text-[#5B7765]">
          {price}
        </span>
      )}
    </button>
  );
}

export default NeedButton;
