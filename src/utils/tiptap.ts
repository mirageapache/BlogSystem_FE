import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';

/**
 * Tiptap 共用擴充設定（取代 draft-js）。
 * StarterKit v3 已內含 Bold / Italic / Underline / Strike / Code / CodeBlock /
 * Blockquote / Heading / BulletList / OrderedList / ListItem / Link / ListKeymap，
 * 故僅需另外加上文字顏色（TextStyle + Color）、標示色（Highlight）、圖片（Image）。
 *
 * 內容一律以 HTML 字串存取（editor.getHTML()），不再使用 draft-js raw state JSON。
 */
export const editorExtensions = [
  StarterKit,
  TextStyle,
  Color.configure({ types: ['textStyle'] }),
  Highlight.configure({ multicolor: true }),
  // 文章內文沿用舊行為以 base64 內嵌圖片（封面/頭像才走後端 FormData 上傳）
  Image.configure({ inline: true, allowBase64: true }),
];
