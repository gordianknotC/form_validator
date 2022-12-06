// const { mergeConfig } = require('vite');
// const path = require("path");
// const root = process.cwd();
module.exports = {
  stories: [
    "./stories/index.stories.js",
    "./stories/*.stories.@(mdx|js|jsx|ts|tsx)"
  ],
  staticDirs: ["../public"],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-docs',
    "@storybook/addon-essentials",
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-vite"
  },
  // async viteFinal(config) {
  //   try{
  //     return mergeConfig(config, {
  //     });
  //   }catch(e){
  //     console.error(e);
  //     throw e;
  //   }
  // },
};

