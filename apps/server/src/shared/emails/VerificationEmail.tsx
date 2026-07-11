import {
  Body,
  Button,
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

interface VerificationEmailProps {
  verficationLink: string;
  baseUrl?: string;
}

export function VerificationEmail({
  verficationLink,
  baseUrl = "localhost:3000",
}: VerificationEmailProps) {
  return (
    <Html>
      <Preview>
        Посилання для скидання пароля до вашого акаунта DniproAnimals
      </Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-10 w-full max-w-150">
            <Section className="mb-6">
              <Row>
                <Column align="right" className="w-1/2 pr-2">
                  <Img
                    src={`${baseUrl}/logo.png`}
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

            <Section className="bg-gray-100 rounded-xl py-10 px-5 text-center">
              <Heading className="text-[32px] font-bold text-black m-0 mb-6">
                Останній крок
              </Heading>

              <Text className="text-base leading-6 text-black m-0 mb-8">
                Дякуємо за створення облікового запису.
                <br />
                Щоб продовжити слідкувати за тваринками, будь
                <br />
                ласка, підтвердьте адресу електронної пошти.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  className="bg-white text-black text-base font-medium no-underline py-3.5 px-6 rounded-lg border border-solid border-gray-300 inline-block"
                  href={verficationLink}
                >
                  Підтвердити Пошту
                </Button>
              </Section>

              <Text className="text-sm leading-5 text-gray-500 m-0">
                Якщо це не ви, просто проігноруйте це
                <br />
                повідомлення
              </Text>
            </Section>

            <Section className="py-8 px-5 text-center">
              <Text className="text-sm leading-5.5 text-black m-0 mb-6">
                «Ми — невелика команда волонтерів, яка робить все можливе
                <br />
                для порятунку тварин. Наш притулок завжди відкритий для тих,
                <br />
                хто хоче навістити наших мешканців.»
              </Text>

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
