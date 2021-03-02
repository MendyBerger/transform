import { html, TemplateResult } from 'lit-html';
import '../src/image-transform.js';

export default {
  title: 'ImageTransform',
  component: 'image-transform',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <image-transform style="--image-transform-background-color: ${backgroundColor}" .title=${title}></image-transform>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
