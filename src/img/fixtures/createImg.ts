// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {vsCodeImg} from '../index';

export type ImgArgs = {
  src: string;
  height: number | undefined;
  width: number | undefined;
}

export function createImg({src, height, width}: ImgArgs) {
  const img = new vsCodeImg();

  console.log("Hello!!!");

  img.src = src;
  if (height !== undefined) {
    img.height = height;
  }

  if (width != undefined) {
    img.width = width;
  }
  /*img.setAttribute('src', src);
  if (height) {
    img.setAttribute('height', height);
  }
  if (width) {
    img.setAttribute('width', width);
  }*/
  console.log(img);
  
  return img;
}