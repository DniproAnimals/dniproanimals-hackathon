import ShelterNeedCard from "./ShelterNeedsCard";
import { shelterNeedsMock } from "./shelterNeeds.mock";

const SheltersNeeds = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <header className="flex items-center gap-3">
            <div className="h-8 w-1.5 shrink-0 rounded-full bg-[#7C4B22]" />

            <h2 className="text-2xl font-bold text-[#0C1014] sm:text-3xl">
              Що потрібно притулкам
            </h2>
          </header>

          {/* Needs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {shelterNeedsMock.map((card) => (
              <ShelterNeedCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SheltersNeeds;
