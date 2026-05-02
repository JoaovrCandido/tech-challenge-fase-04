import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
  "../components/**/*.stories.@(js|jsx|ts|tsx)",
  "../components/**/**/*.stories.@(js|jsx|ts|tsx)",
  "../components/**/**/**/*.stories.@(js|jsx|ts|tsx)",
  "../components/**/**/**/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    'msw-storybook-addon'
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  staticDirs: ["../public"]
};

export default config;
