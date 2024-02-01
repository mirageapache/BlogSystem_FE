import React from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';

/** Article Tags 元件 */
function ArticleTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-3">
      <Link to="/" className="font-bold">
        {text.toUpperCase()}
      </Link>
    </span>
  );
}

/** ArticleItem 參數型別 */
interface ArticleType {
  id: number;
  title: string;
  tags: string[];
  body: string;
}

/** ArticleItem 元件 */
function ArticleItem({ id, title, body, tags }: ArticleType) {
  const tagsList = tags.map((tag) => <ArticleTag key={`${tag}-${id}`} text={tag} />);

  return (
    <div className="text-left border-b-[1px] dark:border-gray-700 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <div className="flex">
        <div className="mr-3">
          {isEmpty(true) ? (
            <span className="w-11 h-11 rounded-full flex justify-center items-center bg-sky-600 font-semibold">
              <p className="text-xl text-center text-white">J</p>
            </span>
          ) : (
            <img className="w-11 h-11 rounded-full" src="" alt="author avatar" />
          )}
        </div>
        <div className="">
          <div className="flex justify-between text-md text-gray-600 dark:text-gray-300 my-1">
            <span className="flex items-center">
              <p className="mr-1">James</p>
              <p className="text-sm hover:text-orange-500 cusor-pointer my-1">(james_w)</p>
            </span>
            <p className="">20240101</p>
          </div>
          <div>
            <h2 className="font-semibold text-2xl xl:text-3xl">
              <Link to={`/article/${id}`} className="hover:underline">
                {title}
              </Link>
            </h2>
            <div className="text-orange-500">{tagsList}</div>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleItem;

// 名稱 認證標誌 貼文時間
// 帳號 追蹤鈕
// 內文
// 喜歡數 回覆數 分享
