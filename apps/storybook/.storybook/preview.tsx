import { cn } from "@dniproanimals/ui";
import "@dniproanimals/ui/theme.css";
import type { Preview } from "@storybook/react";
import { Geist, Geist_Mono } from "next/font/google";

const fontSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const fontMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "font-sans bg-background text-foreground",
        )}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
