import type { StorybookConfig } from "@storybook/nextjs-vite";
import postcss from "@tailwindcss/postcss";

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.css ??= {};
    config.css.postcss = {
      plugins: [postcss],
    };
    return config;
  },
};

export default config;
