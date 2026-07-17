import type { CreateAdoptionBody } from "@dniproanimals/contracts";
import {
  Body,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface AdoptionAdminEmailProps {
  body: CreateAdoptionBody;
  animalName: string;
  baseUrl?: string;
  date?: Date;
}

export function AdoptionAdminEmail({
  body,
  animalName,
  baseUrl = "localhost:3000",
  date = new Date(),
}: AdoptionAdminEmailProps) {
  const formattedDate =
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const hasAdditionalContacts =
    body.location || body.telegram || body.instagram || body.facebook;

  return (
    <Html>
      <Preview>Нова заявка на всиновлення: {animalName}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-10 w-full max-w-150">
            <Section className="mb-6">
              <Row>
                <Column align="right" className="w-1/2 pr-2">
                  <Img
                    src={`${baseUrl}/static/logo.png`}
                    width="48"
                    height="48"
                    alt="DniproAnimals Logo"
                    className="rounded-full"
                  />
                </Column>
                <Column align="left" className="w-1/2">
                  <Text className="text-2xl font-bold text-black m-0">
                    DniproAnimals
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="bg-gray-100 rounded-xl py-10 px-8">
              <Heading className="text-[32px] font-bold text-black m-0 mb-8 text-center">
                Хтось звернувся
              </Heading>

              <Text className="text-base text-black m-0 mb-6">
                Надійшла нова заявка на всиновлення тварини.
              </Text>

              <Section className="mb-6">
                <Row className="mb-2">
                  <Column className="w-45 font-bold text-black text-base align-top">
                    Ім'я тварини:
                  </Column>
                  <Column className="text-black text-base align-top">
                    {animalName}
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Column className="w-45 font-bold text-black text-base align-top">
                    ПІБ заявника:
                  </Column>
                  <Column className="text-black text-base align-top">
                    {body.name}
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Column className="w-45 font-bold text-black text-base align-top">
                    Електронна пошта:
                  </Column>
                  <Column className="text-black text-base align-top">
                    <a
                      href={`mailto:${body.email}`}
                      className="text-black no-underline"
                    >
                      {body.email}
                    </a>
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Column className="w-45 font-bold text-black text-base align-top">
                    Номер телефону:
                  </Column>
                  <Column className="text-black text-base align-top">
                    {body.phone}
                  </Column>
                </Row>
              </Section>

              {body.message && (
                <Section className="mb-6">
                  <Text className="font-bold text-black text-base m-0 mb-1">
                    Опис від заявника:
                  </Text>
                  <Text className="text-black text-base m-0 leading-6">
                    {body.message}
                  </Text>
                </Section>
              )}

              {hasAdditionalContacts && (
                <Section className="mb-8">
                  <Text className="font-bold text-black text-base m-0 mb-1">
                    Додаткові контакти:
                  </Text>
                  <Text className="text-black text-base m-0 leading-6">
                    {body.location && `Локація: ${body.location}\n`}
                    {body.telegram && `Telegram: ${body.telegram}\n`}
                    {body.instagram && `Instagram: ${body.instagram}\n`}
                    {body.facebook && `Facebook: ${body.facebook}`}
                  </Text>
                </Section>
              )}

              <Section>
                <Row>
                  <Column className="w-50 font-bold text-black text-base">
                    Дата подання заявки:
                  </Column>
                  <Column className="text-black text-base">
                    {formattedDate}
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section className="py-8 px-5 text-center">
              <Section className="w-35 mx-auto mb-6">
                <Row>
                  <Column align="center" className="px-2.5">
                    <Img
                      src={`${baseUrl}/static/icon-instagram.png`}
                      width="24"
                      height="24"
                      alt="Instagram"
                    />
                  </Column>
                  <Column align="center" className="px-2.5">
                    <Img
                      src={`${baseUrl}/static/icon-facebook.png`}
                      width="24"
                      height="24"
                      alt="Facebook"
                    />
                  </Column>
                  <Column align="center" className="px-2.5">
                    <Img
                      src={`${baseUrl}/static/icon-telegram.png`}
                      width="24"
                      height="24"
                      alt="Telegram"
                    />
                  </Column>
                </Row>
              </Section>

              <Text className="text-sm text-gray-700 m-0">
                м. Дніпро, вул. Героїв Дніпра
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
