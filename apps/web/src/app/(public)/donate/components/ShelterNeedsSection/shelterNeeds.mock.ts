import type { ShelterNeedCard } from "./shelterNeeds.types";

export const shelterNeedsMock: ShelterNeedCard[] = [
  {
    id: "food",
    title: "Корми та смаколики",
    icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mMBhTdpFq6/3kmjddoh_expires_30_days.png",
    gradient: "linear-gradient(180deg, #CED48C, #5B7765)",
    subgroups: [
      {
        id: "wet-cat-food",
        title: "Вологі корми для котів",
        items: [
          {
            id: "club-4-lapy",
            name: "Клуб 4 лапи",
            price: "~25₴",
          },
          {
            id: "felix",
            name: "Фелікс",
            price: "~20₴",
          },
          {
            id: "gourmet",
            name: "Гурме",
            price: "~35₴",
          },
        ],
      },
      {
        id: "dry-food-4-lapy",
        title: "Сухий корм 4 лапи",
        items: [
          {
            id: "puppy-food",
            name: "Для цуценят всіх порід",
            price: "~120₴/кг",
          },
          {
            id: "medium-dog-food",
            name: "Для собак середніх порід",
            price: "~100₴/кг",
          },
        ],
      },
      {
        id: "proplan",
        title: "Проплан",
        items: [
          {
            id: "renal-pate",
            name: "Ренал паштети",
            price: "~95₴",
          },
        ],
      },
    ],
    items: [],
  },

  {
    id: "medicine",
    title: "Мед. препарати",
    icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mMBhTdpFq6/d49k2qzl_expires_30_days.png",
    gradient: "linear-gradient(180deg, #FFA1A2, #FA2B36)",
    items: [
      {
        id: "serenia",
        name: "Серенія",
      },
      {
        id: "cladax-40",
        name: "Кладакса 40 мг",
      },
      {
        id: "renal-vet",
        name: "РеналВет (таблетки / флакони)",
      },
      {
        id: "epobiokorin-2000",
        name: "Епобіокорін2000",
      },
      {
        id: "hepadol-mini",
        name: "Гепадол міні",
      },
      {
        id: "viraxa-heptral",
        name: "Віракса, гептрал",
      },
      {
        id: "ferum-milgamma",
        name: "Ферум лек, мільгама (в ампулах)",
      },
      {
        id: "kvamatel-omez",
        name: "Квамател і омез (у флаконах)",
      },
    ],
  },

  {
    id: "household",
    title: "Побутова хімія",
    icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mMBhTdpFq6/fn7bm9k4_expires_30_days.png",
    gradient: "linear-gradient(180deg, #8DC5FF, #2B7FFF)",
    items: [
      {
        id: "perwoll",
        name: "Гель для прання Перволь",
      },
      {
        id: "fairy",
        name: "Фері для посуду",
      },
      {
        id: "domestos",
        name: "Доместос",
      },
      {
        id: "mr-proper",
        name: "Містер пропер для підлоги",
      },
      {
        id: "trash-bags",
        name: "Пакети для сміття 120 л",
      },
      {
        id: "clean-rags",
        name: "Чисте ганчір'я з натуральних тканин",
      },
      {
        id: "paper-towels",
        name: "Одноразові рушники",
      },
      {
        id: "diapers",
        name: "Одноразові пелюшки 60x60, 90x60",
      },
    ],
  },

  {
    id: "other",
    title: "Інше важливе",
    icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mMBhTdpFq6/y4kyo6k2_expires_30_days.png",
    gradient: "linear-gradient(180deg, #D9B1FF, #AC46FF)",
    items: [
      {
        id: "toys",
        name: "Іграшки для котів та собак",
      },
      {
        id: "beds",
        name: "Лежанки",
      },
      {
        id: "scratching-posts",
        name: "Дряпки",
      },
      {
        id: "cat-complexes",
        name: "Комплекси для котиків",
      },
    ],
  },

  {
    id: "warming",
    title: "Для утеплення",
    icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/mMBhTdpFq6/xghsfqvy_expires_30_days.png",
    gradient: "linear-gradient(180deg, #FFB869, #FF6800)",
    items: [
      {
        id: "large-blankets",
        name: "Великі покривала",
      },
      {
        id: "throws",
        name: "Пледи",
      },
      {
        id: "blankets",
        name: "Ковдри",
      },
    ],
  },
];
