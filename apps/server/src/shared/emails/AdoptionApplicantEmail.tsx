import {
  Body,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface AdoptionApplicantEmailProps {
  applicantName: string;
  animalName: string;
  phone: string;
}

export function AdoptionApplicantEmail({
  applicantName,
  animalName,
  phone,
}: AdoptionApplicantEmailProps) {
  return (
    <Html>
      <Preview>Ми отримали вашу заявку на прихисток {animalName}</Preview>
      <Tailwind>
        <Body className="bg-[#f5f5ef] font-sans">
          <Container className="mx-auto w-full max-w-150 px-5 py-10">
            <Section className="rounded-2xl bg-white px-6 py-8">
              <Text className="m-0 mb-2 text-center text-sm font-bold text-[#5b7765]">
                DniproAnimals
              </Text>
              <Heading className="m-0 mb-4 text-center text-3xl font-bold text-[#0c1014]">
                Дякуємо за вашу заявку
              </Heading>
              <Text className="m-0 mb-4 text-base leading-6 text-[#0c1014]">
                Вітаємо, {applicantName}! Ми отримали вашу заявку на прихисток{" "}
                {animalName}. Дякуємо за бажання подарувати тваринці дім.
              </Text>
              <Section className="mb-4 rounded-xl bg-[#eef0d3] px-4 py-4">
                <Text className="m-0 text-base font-bold text-[#0c1014]">
                  Що буде далі
                </Text>
                <Text className="m-0 mt-2 text-base leading-6 text-[#0c1014]">
                  Після опрацювання заявки наші волонтери зателефонують вам за
                  номером {phone}, щоб уточнити деталі та домовитися про
                  наступні кроки.
                </Text>
              </Section>
              <Text className="m-0 text-base leading-6 text-[#0c1014]">
                Будь ласка, очікуйте на дзвінок і переконайтеся, що вказаний
                номер телефону доступний для зв'язку.
              </Text>
            </Section>
            <Text className="m-0 pt-6 text-center text-sm text-[#5b7765]">
              Дякуємо, що допомагаєте тваринам Дніпра.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
