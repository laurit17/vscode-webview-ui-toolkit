import {attr} from '@microsoft/fast-element';
import {
  FoundationElement,
  StartEndOptions,
  FoundationElementDefinition,
} from '@microsoft/fast-foundation'

export type ImgOptions = FoundationElementDefinition & StartEndOptions;

export class Img extends FoundationElement {

  /**
   * The source of the image
   */
  @attr public src: string;

  /**
   * The width of the image
   */
  @attr public width: string;

  /**
   * The height of the image
   */
  @attr public height: string;

  /**
   * A reference to the internal image element
   * @internal
   */
  control: HTMLImageElement;
}

export const vsCodeImage = Img.compose<ImgOptions, typeof Img>({
  baseName: "img",
});



