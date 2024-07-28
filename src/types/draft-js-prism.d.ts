/* eslint-disable no-unused-vars */
declare module 'draft-js-prism' {
  import { DraftDecoratorType } from 'draft-js';
  import Prism from 'prismjs';

  interface PrismDecoratorProps {
    prism: typeof Prism;
    defaultLanguage?: string;
    getSyntax?(block: any): string;
  }

  export default class PrismDecorator implements DraftDecoratorType {
    constructor(props: PrismDecoratorProps);

    getDecorations(block: any, contentState: any): any;

    getComponentForKey(key: string): any;

    getPropsForKey(key: string): any;
  }
}
