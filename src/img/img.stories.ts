// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {action} from '@storybook/addon-actions';
import { ImgArgs, createImg } from './fixtures/createImg';

const Template = ({...args}: ImgArgs) => {
  return createImg({...args});
};

export const Default: any = Template.bind({});
Default.args = {
  src: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
  width: "100",
  height: "100",
};
Default.parameters = {
  docs: {
    source: {
      code: `<vscode-image src="https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" height="100" width="100"/>`
    }
  }
};
