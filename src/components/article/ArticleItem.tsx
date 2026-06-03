/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// --- components / functions ---
import UserInfoPanel from 'components/user/UserInfoPanel';
import { formatDateTime } from 'utils/dateTime';
import { ArticleDataType } from 'types/articleType';
import { HINT_LABEL } from 'constants/LayoutConstants';

/** Article Tags 元件 */
// function ArticleTag(props: { text: string }) {
//   const { text } = props;
//   return (
//     <span className="mr-3">
//       <Link to="/" className="font-bold">
//         {text.toUpperCase()}
//       </Link>
//     </span>
//   );
// }

/** ArticleItem 元件 */
function ArticleItem(props: { articleData: ArticleDataType }) {
  const navigate = useNavigate();
  const { articleData } = props;
  const [showCreateTip, setShowCreateTip] = useState(false);
  const { _id, title, author, createdAt } = articleData;
  // 內容已是 HTML（Tiptap），預覽直接淨化後渲染
  const htmlContent = DOMPurify.sanitize(articleData.content || '');
  // const tagsList = hashTags.map((tag) => <ArticleTag key={`${tag}-${_id}`} text={tag} />);

  return (
    <div
      className="text-left border-b-[1px] p-1 sm:p-2 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
      onClick={() => {
        navigate(`/article/${_id}`);
      }}
    >
      <div className="flex w-full justify-between">
        <UserInfoPanel
          userId={author._id}
          account={author.account}
          name={author.name}
          avatarUrl={author.avatar}
          bgColor={author.bgColor}
          className="my-2"
        />
        <div className="flex flex-col justify-center items-end">
          <span
            className="relative my-0.5"
            onMouseEnter={() => setShowCreateTip(true)}
            onMouseLeave={() => setShowCreateTip(false)}
          >
            <p className="text-gray-600 dark:text-gray-300">{formatDateTime(createdAt)}</p>
            <span
              className={`top-[-50px] right-0 w-40 ${HINT_LABEL} ${showCreateTip ? 'block' : 'hidden'}`}
            >
              Created at {moment(createdAt).format('MMMM Do YYYY, h:mm:ss')}
            </span>
          </span>
        </div>
      </div>
      <div className="pb-3">
        <h2 className="font-semibold text-2xl xl:text-3xl">
          <span className="hover:underline hover:text-orange-500">{title}</span>
        </h2>
        <div
          className="max-h-[150px] text-gray-600 dark:text-gray-300 line-clamp-5"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

export default ArticleItem;
