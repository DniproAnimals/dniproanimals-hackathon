import type { StorybookConfig } from "@storybook/nextjs-vite";
import postcss from "@tailwindcss/postcss";
import path from "node:path";
import { fileURLToPath } from "node:url";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../../../packages/ui/src/**/*.stories.@(ts|tsx)",
    "../stories/**/*.stories.@(ts|tsx)",
  ],
  staticDirs: [{ from: "../../web/public", to: "/" }],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.css ??= {};
    config.css.postcss = {
      plugins: [postcss],
    };
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(storybookDir, "../../web/src"),
    };
    return config;
  },
};

export default config;
