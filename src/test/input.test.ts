// utils/input.ts handleHashTag 測試（Phase 3.1 Batch B）
// 對應 UPGRADE_PLAN 3.1 第 3 項：中文 hashtag、多行、空字串。
import { handleHashTag } from '../utils/input';

describe('utils/input handleHashTag', () => {
  test('純文字（無 #）→ 包成段落 div、hashTags 為空', () => {
    const { formattedContent, hashTags } = handleHashTag('hello world');
    expect(hashTags).toEqual([]);
    expect(formattedContent).toBe('<div class="paragraph">hello world</div>');
  });

  test('單一英文 hashtag → 收集標籤並轉為 <a> 連結', () => {
    const { formattedContent, hashTags } = handleHashTag('看看 #react 很讚');
    expect(hashTags).toEqual(['react']);
    expect(formattedContent).toContain('class="hash-tag"');
    expect(formattedContent).toContain('search=react');
    expect(formattedContent).toContain('>#react</a>');
  });

  test('中文 hashtag → \\p{L} 可正確比對', () => {
    const { hashTags } = handleHashTag('#中文標籤 測試');
    expect(hashTags).toEqual(['中文標籤']);
  });

  test('同一行多個 hashtag → 全部收集', () => {
    const { hashTags } = handleHashTag('#a #b');
    expect(hashTags).toEqual(['a', 'b']);
  });

  test('多行內容 → 各行各自包段落、跨行收集標籤', () => {
    const { formattedContent, hashTags } = handleHashTag('第一行\n#tag1');
    expect(hashTags).toEqual(['tag1']);
    expect(formattedContent).toBe(
      '<div class="paragraph">第一行</div><div class="paragraph"><a class="hash-tag" href="/explore?tag=tag&search=tag1">#tag1</a></div>'
    );
  });

  test('空字串 → formattedContent 為空、無標籤', () => {
    expect(handleHashTag('')).toEqual({ formattedContent: '', hashTags: [] });
  });

  test('純空白 → 視為空內容', () => {
    expect(handleHashTag('   ')).toEqual({ formattedContent: '', hashTags: [] });
  });
});
