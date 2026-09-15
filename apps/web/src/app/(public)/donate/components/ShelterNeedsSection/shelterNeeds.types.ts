export type ShelterNeedItem = {
  id: string;
  name: string;
  price?: string;
};

export type ShelterNeedCard = {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  color?: string;
  variant?: "default";
  items: ShelterNeedItem[];
  subgroups?: {
    id: string;
    title: string;
    items: ShelterNeedItem[];
  }[];
};
