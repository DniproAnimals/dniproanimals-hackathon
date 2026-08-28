import {
  Body,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface AnimalSupportUpdateEmailProps {
  animalName: string;
  animalUrl: string;
  photos: string[];
}

export function AnimalSupportUpdateEmail({
  animalName,
  animalUrl,
  photos,
}: AnimalSupportUpdateEmailProps) {
  return (
    <Html>
      <Preview>Нові фото від {animalName}</Preview>
      <Tailwind>
        <Body className="bg-[#f5f5ef] font-sans">
          <Container className="mx-auto w-full max-w-150 px-5 py-10">
            <Section className="rounded-2xl bg-white px-6 py-8">
              <Text className="m-0 mb-2 text-center text-sm font-bold text-[#5b7765]">
                DniproAnimals
              </Text>
              <Heading className="m-0 mb-4 text-center text-3xl font-bold text-[#0c1014]">
                Новини від {animalName}
              </Heading>
              <Text className="m-0 mb-6 text-base leading-6 text-[#0c1014]">
                Дякуємо, що підтримуєте {animalName}. Завдяки вам ми можемо
                піклуватися про тварину щодня. Ділимося новими фотографіями.
              </Text>

              {photos.map((photo, index) => (
                <Img
                  key={photo}
                  src={photo}
                  width="520"
                  alt={`${animalName}: фото ${index + 1}`}
                  className="mb-4 w-full rounded-xl"
                />
              ))}

              <Section className="pt-3 text-center">
                <Link
                  href={animalUrl}
                  className="inline-block rounded-lg bg-[#5b7765] px-5 py-3 font-bold text-white no-underline"
                >
                  Переглянути сторінку тварини
                </Link>
              </Section>
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
