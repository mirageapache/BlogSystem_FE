/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// --- components / functions ---
import UserInfoPanel from 'components/user/UserInfoPanel';
import { formatDateTime } from 'utils/dateTime';
import { ArticleDataType } from 'types/articleType';
import { HINT_LABEL } from 'constants/LayoutConstants';

/** ArticleItem 元件 */
function TiptapArticleItem(props: { articleData: ArticleDataType }) {
  const navigate = useNavigate();
  const { articleData } = props;
  const [htmlContent, setHtmlContent] = useState('');
  const [showCreateTip, setShowCreateTip] = useState(false);
  const { _id, title, author, createdAt } = articleData;

  useEffect(() => {
    if (articleData) {
      setHtmlContent(articleData?.content);
    }
  }, [articleData]);

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

export default TiptapArticleItem;
