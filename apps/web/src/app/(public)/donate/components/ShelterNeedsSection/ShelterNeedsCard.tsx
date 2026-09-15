import NeedButton from "./NeedsButton";
import { getShelterNeedIcon } from "./shelterNeedIcons";
import type { ShelterNeedCard as ShelterNeedCardType } from "./shelterNeeds.types";

type Props = {
  card: ShelterNeedCardType;
};

const ShelterNeedCard = ({ card }: Props) => {
  const hasSubgroups = card.subgroups && card.subgroups.length > 0;
  const selectedIcon = getShelterNeedIcon(card.icon);

  return (
    <article
      className={[
        "min-w-0 overflow-hidden rounded-3xl",
        "border border-solid border-neutral-100",
        "bg-white pt-px",
      ].join(" ")}
      style={{
        boxShadow: "0px 1px 2px #0000001A",
      }}
    >
      {/* Colored top border */}
      <div
        className="mx-px mb-5 h-1"
        style={{
          background: card.color || card.gradient,
        }}
      />

      {/* Header */}
      <div className="mb-5 flex items-center gap-3 px-6">
        {selectedIcon ? (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: selectedIcon.background,
            }}
          >
            <selectedIcon.icon
              size={24}
              stroke="1.8"
              style={{
                color: selectedIcon.color,
              }}
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            ?
          </div>
        )}

        <h3 className="text-lg font-bold text-[#0C1014]">{card.title}</h3>
      </div>

      {/* Content */}
      <div className="flex flex-wrap items-start gap-2 px-6 pb-8">
        {hasSubgroups ? (
          <div className="flex w-full flex-col gap-5">
            {card.subgroups?.map((group) => (
              <div key={group.id} className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#5B7765]">
                  {group.title}
                </span>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <NeedButton
                      key={item.id}
                      label={item.name}
                      price={item.price}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          card.items.map((item) => (
            <NeedButton key={item.id} label={item.name} price={item.price} />
          ))
        )}
      </div>
    </article>
  );
};

export default ShelterNeedCard;
