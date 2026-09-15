import type { ReactNode } from "react";
import {
  Body,
  Container,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";
import { EmailRichText } from "./EmailRichText";

interface EmailLayoutProps {
  preview: string;
  content: string;
  actionUrl?: string;
  children?: ReactNode;
}

export function EmailLayout({
  preview,
  content,
  actionUrl,
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
              <EmailRichText
                content={content}
                actionUrl={actionUrl}
                className="m-0 mb-4 text-base leading-6 text-[#0c1014]"
              />
              {children}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
