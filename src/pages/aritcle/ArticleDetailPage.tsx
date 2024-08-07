/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-danger */
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- api ---
import { getArticleDetail } from '../../api/article';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import NoSearchResult from '../../components/tips/NoSearchResult';
import Spinner from '../../components/tips/Spinner';

function ArticleDetailPage() {
  const { id } = useParams();
  const { isLoading, error, data } = useQuery(['articleDetail', id], () => getArticleDetail(id!));
  const articleData = get(data, 'data');

  if (isLoading) return <Spinner />;
  if (error) return <p>Error</p>;
  if (isEmpty(articleData)) {
    return (
      <NoSearchResult
        msgOne="該文章不存在或已刪除"
        msgTwo="無法瀏覽內容，請重新操作"
        type="article"
      />
    );
  }

  return (
    <div className="flex justify-center w-full md:w-[600px]">
      <div className="flex flex-col w-full m-5">
        <div className=" flex items-center border-b-[1px] xl:border-b-0 dark:border-gray-700">
          <button
            aria-label="back"
            type="button"
            className="flex items-center mr-4 p-2 text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
            onClick={() => history.back()}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'circle-left', style: 'solid' })}
              className="w-7 h-7"
            />
          </button>
          <div className="flex justify-between items-center w-full xl:border-b-[1px] dark:border-gray-700">
            {/* 作者資訊 */}
            <UserInfoPanel
              userId={articleData.author._id}
              account={articleData.author.account}
              name={articleData.author.name}
              avatarUrl={articleData.author.avatar}
              bgColor={articleData.author.bgColor}
              className="my-4"
            />

            {/* 文章資訊 */}
            <ArticleInfoPanel articleData={articleData} />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="text-4xl my-4">{articleData.title}</h2>

          {/* 文章內文 */}
          <div className="">
            <div dangerouslySetInnerHTML={{ __html: articleData.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
