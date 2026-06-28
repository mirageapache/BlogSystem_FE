/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import DOMPurify from 'dompurify';
import dayjs from 'utils/dayjs';
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
      className="group text-left mb-4 p-4 sm:p-5 rounded-card bg-surface border border-line shadow-card hover:shadow-card-hover hover:border-line-strong transition-all duration-200 cursor-pointer"
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
            <p className="text-sm text-muted">{formatDateTime(createdAt)}</p>
            <span
              className={`top-[-50px] right-0 w-40 ${HINT_LABEL} ${showCreateTip ? 'block' : 'hidden'}`}
            >
              Created at {dayjs(createdAt).format('MMMM Do YYYY, HH:mm:ss')}
            </span>
          </span>
        </div>
      </div>
      <div className="pt-1 pb-1">
        <h2 className="text-2xl xl:text-3xl text-ink leading-snug transition-colors group-hover:text-brand">
          {title}
        </h2>
        <div
          className="mt-2 max-h-[120px] text-ink-soft leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

export default ArticleItem;
