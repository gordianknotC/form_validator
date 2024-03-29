// YourComponent.stories.js


//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'YourComponent',
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => ({
  components: {  },
  setup() {
    //👇 The args will now be passed down to the template
    return { args };
  },
  template: '<YourComponent v-bind="args"/>',
});

export const FirstStory = Template.bind({});

FirstStory.args = {
  /* 👇 The args you need here will depend on your component */
};