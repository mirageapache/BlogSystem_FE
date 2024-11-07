import { isEmpty } from 'lodash';

/** 處理 hash tag */
export const handleHashTag = (inputContent: string) => {
  // 因使用contenteditable方法再不同瀏覽器中渲染HTML的處理方式不同，因此須統一在每一行內容包裹在 <div> 標籤中
  let formattedContent = '';
  const hashTags: string[] = []; // 儲存hashTag，後續存到DB供搜尋使用
  const regex = /#([\p{L}\p{N}]+)(?=\s|$)/gu; // 正規表達式判斷"#"開頭"空白"結尾的字串(包含中文字)
  const phaseArr = inputContent.split('\n\n').join('\n').split('\n'); // 拆解段落

  // 處理hash tag
  const hashTag = phaseArr.map((phase) => {
    if (phase.includes('#')) {
      return phase.replace(regex, (match, p1) => {
        hashTags.push(match.substring(1));
        return `<a class="hash-tag" href="/explore?tag=tag&search=${p1}" onclick="event.stopPropagation();">${match}</a>`;
      });
    }
    return phase;
  });

  if ((hashTag.length <= 1 && isEmpty(hashTag[0])) || hashTag.join('').trim().length === 0) {
    formattedContent = '';
  } else {
    formattedContent = hashTag
      .map((line) => `<div class="paragraph">${line}</div>`) // 重組段落
      .join('');
  }

  return { formattedContent, hashTags };
};
