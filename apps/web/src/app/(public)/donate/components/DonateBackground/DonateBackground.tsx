import { PawIcon } from "@dniproanimals/icons";

export function DonateBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-[-1]">
      <PawIcon className="absolute top-[5%] left-[5%] size-32 -rotate-12" />
      <PawIcon className="absolute top-[20%] right-[10%] size-48 rotate-45" />
    </div>
  );
}
