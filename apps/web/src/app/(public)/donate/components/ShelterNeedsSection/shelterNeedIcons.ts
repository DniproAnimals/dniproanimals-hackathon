import {
  IconAmbulance,
  IconApple,
  IconArchive,
  IconBandage,
  IconBath,
  IconBed,
  IconBell,
  IconBone,
  IconBowl,
  IconBuildingHospital,
  IconBuildingWarehouse,
  IconCat,
  IconCertificate,
  IconClipboard,
  IconClock,
  IconCloudRain,
  IconDog,
  IconDroplet,
  IconFirstAidKit,
  IconHeart,
  IconHome,
  IconHomeHeart,
  IconHorse,
  IconLeaf,
  IconPill,
  IconPlant,
  IconScissors,
  IconShirt,
  IconShoppingCart,
  IconStethoscope,
  IconTools,
  IconTrash,
  IconTruck,
  IconVaccine,
  IconWash,
} from "@dniproanimals/icons";

import { PawIcon } from "@dniproanimals/icons";

export const shelterNeedIcons = {
  house: {
    icon: IconHome,
    color: "#7C4B22",
    background: "#F3E8DE",
    label: "Притулок",
  },

  houseHeart: {
    icon: IconHomeHeart,
    color: "#C45B5B",
    background: "#F8E5E5",
    label: "Дім",
  },

  dog: {
    icon: IconDog,
    color: "#5B7765",
    background: "#E7EFE9",
    label: "Собаки",
  },

  cat: {
    icon: IconCat,
    color: "#8064A2",
    background: "#EEE9F5",
    label: "Коти",
  },

  bone: {
    icon: IconBone,
    color: "#C47A42",
    background: "#F8EBDD",
    label: "Кістки",
  },

  food: {
    icon: IconBowl,
    color: "#B47728",
    background: "#F8EEDB",
    label: "Їжа",
  },

  apple: {
    icon: IconApple,
    color: "#B84D4D",
    background: "#F8E4E4",
    label: "Харчування",
  },

  medicine: {
    icon: IconPill,
    color: "#4B79A8",
    background: "#E5EFF8",
    label: "Ліки",
  },

  firstAid: {
    icon: IconFirstAidKit,
    color: "#C45656",
    background: "#F8E5E5",
    label: "Перша допомога",
  },

  bandage: {
    icon: IconBandage,
    color: "#A66A42",
    background: "#F5EADF",
    label: "Бинти",
  },

  vaccine: {
    icon: IconVaccine,
    color: "#5D78A6",
    background: "#E8EEF8",
    label: "Вакцинація",
  },

  doctor: {
    icon: IconStethoscope,
    color: "#467B76",
    background: "#E4F0EE",
    label: "Ветеринар",
  },

  hospital: {
    icon: IconBuildingHospital,
    color: "#A14E63",
    background: "#F6E6EB",
    label: "Клініка",
  },

  ambulance: {
    icon: IconAmbulance,
    color: "#B95757",
    background: "#F8E5E5",
    label: "Допомога",
  },

  water: {
    icon: IconDroplet,
    color: "#4E83A8",
    background: "#E4F0F8",
    label: "Вода",
  },

  bed: {
    icon: IconBed,
    color: "#76689B",
    background: "#ECE9F5",
    label: "Лежанки",
  },

  bath: {
    icon: IconBath,
    color: "#4B8A8A",
    background: "#E5F2F2",
    label: "Догляд",
  },

  wash: {
    icon: IconWash,
    color: "#5485A0",
    background: "#E6F0F5",
    label: "Прання",
  },

  cleaning: {
    icon: IconTrash,
    color: "#697A5E",
    background: "#E9EFE6",
    label: "Прибирання",
  },

  tools: {
    icon: IconTools,
    color: "#856D4A",
    background: "#F2ECE1",
    label: "Інструменти",
  },

  scissors: {
    icon: IconScissors,
    color: "#805C82",
    background: "#F0E8F1",
    label: "Стрижка",
  },

  clothes: {
    icon: IconShirt,
    color: "#587A94",
    background: "#E7EEF4",
    label: "Одяг",
  },

  truck: {
    icon: IconTruck,
    color: "#657B61",
    background: "#E8EEE6",
    label: "Транспорт",
  },

  warehouse: {
    icon: IconBuildingWarehouse,
    color: "#806A4B",
    background: "#F1ECE4",
    label: "Склад",
  },

  shopping: {
    icon: IconShoppingCart,
    color: "#6E6595",
    background: "#ECEAF4",
    label: "Покупки",
  },

  heart: {
    icon: IconHeart,
    color: "#C05C68",
    background: "#F8E5E8",
    label: "Турбота",
  },

  paw: {
    icon: PawIcon,
    color: "#7C4B22",
    background: "#F3E8DE",
    label: "Лапка",
  },

  horse: {
    icon: IconHorse,
    color: "#806344",
    background: "#F1EADF",
    label: "Коні",
  },

  leaf: {
    icon: IconLeaf,
    color: "#5B7765",
    background: "#E6EFE8",
    label: "Природа",
  },

  plant: {
    icon: IconPlant,
    color: "#66805C",
    background: "#E9F0E5",
    label: "Рослини",
  },

  certificate: {
    icon: IconCertificate,
    color: "#9A7144",
    background: "#F4ECDF",
    label: "Документи",
  },

  clipboard: {
    icon: IconClipboard,
    color: "#63758A",
    background: "#E9EEF3",
    label: "Облік",
  },

  archive: {
    icon: IconArchive,
    color: "#746B5C",
    background: "#EFEBE4",
    label: "Зберігання",
  },

  clock: {
    icon: IconClock,
    color: "#697B8A",
    background: "#E9EFF3",
    label: "Час",
  },

  bell: {
    icon: IconBell,
    color: "#A76A47",
    background: "#F4EAE3",
    label: "Сповіщення",
  },

  rain: {
    icon: IconCloudRain,
    color: "#5B7F99",
    background: "#E7EEF3",
    label: "Погода",
  },
} as const;

export type ShelterNeedIcon = keyof typeof shelterNeedIcons;

export const getShelterNeedIcon = (icon: string) => {
  return shelterNeedIcons[icon as ShelterNeedIcon];
};
