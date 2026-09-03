import type { ReactNode } from "react";
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

interface EmailLayoutProps {
  preview: string;
  heading: string;
  footer: string;
  children: ReactNode;
}

export function EmailLayout({
  preview,
  heading,
  footer,
  children,
}: EmailLayoutProps) {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-[#f5f5ef] font-sans">
          <Container className="mx-auto w-full max-w-150 px-5 py-10">
            <Section className="rounded-2xl bg-white px-6 py-8">
              <Text className="m-0 mb-2 text-center text-sm font-bold text-[#5b7765]">
                DniproAnimals
              </Text>
              <Heading className="m-0 mb-4 text-center text-3xl font-bold text-[#0c1014]">
                {heading}
              </Heading>
              {children}
            </Section>
            <Text className="m-0 whitespace-pre-line pt-6 text-center text-sm leading-5 text-[#5b7765]">
              {footer}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
