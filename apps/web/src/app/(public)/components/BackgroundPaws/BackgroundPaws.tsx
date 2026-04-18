import { PawIcon } from "@dniproanimals/icons";

export function BackgroundPaws() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[-1]">
      <PawIcon className="absolute top-[5%] left-[5%] size-32 -rotate-12" />
      <PawIcon className="absolute top-[20%] right-[10%] size-48 rotate-45" />
      <PawIcon className="absolute top-[40%] left-[15%] size-24 rotate-12" />
      <PawIcon className="absolute bottom-[30%] right-[20%] size-40 -rotate-45" />
      <PawIcon className="absolute bottom-[10%] left-[30%] size-20 rotate-90" />
      <PawIcon className="absolute top-[60%] right-[5%] size-32 rotate-180" />
    </div>
  );
}
