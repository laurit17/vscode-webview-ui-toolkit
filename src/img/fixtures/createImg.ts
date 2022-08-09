// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {Img} from '../index';

export type ImgArgs = {
  src: string;
  height: string | undefined;
  width: string | undefined;
}

export function createImg({src, height, width}: ImgArgs) {
  const img = new Img();

  img.setAttribute('src', src);
  if (height) {
    img.setAttribute('height', height);
  }
  if (width) {
    img.setAttribute('width', width);
  }
  
  return img;
}