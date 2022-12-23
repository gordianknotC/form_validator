"use strict";
// YourComponent.stories.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstStory = void 0;
//👇 This default export determines where your story goes in the story list
exports.default = {
    /* 👇 The title prop is optional.
    * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
    * to learn how to generate automatic titles
    */
    title: 'YourComponent',
};
//👇 We create a “template” of how args map to rendering
const Template = (args) => ({
    components: {},
    setup() {
        //👇 The args will now be passed down to the template
        return { args };
    },
    template: '<YourComponent v-bind="args"/>',
});
exports.FirstStory = Template.bind({});
exports.FirstStory.args = {
/* 👇 The args you need here will depend on your component */
};
//# sourceMappingURL=index.stories.js.map