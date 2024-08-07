import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
// --- api ---
import { getAllPosts } from '../../api/post';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import ContentSection from '../../components/article/ContentSection';
import Spinner from '../../components/tips/Spinner';
import { getArticleDetail } from 'api/article';
import { get, isEmpty } from 'lodash';
import NoSearchResult from 'components/tips/NoSearchResult';

function ArticleDetailPage() {
  const { id } = useParams();
  const { isLoading, error, data } = useQuery('articleDetail', () => getArticleDetail(id!));
  const articleData = get(data, 'data');

  console.log(articleData);

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
    <div className="flex justify-center">
      <div className="flex flex-col max-w-[750px] m-5">
        <h2 className="text-4xl border-b-[1px] dark:border-gray-700 pb-4">{articleData.title}</h2>
        <div className="flex flex-col w-full">
          <div className="w-full">
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
            <ArticleInfoPanel />
          </div>
          
          {/* 文章內文 */}
          <div className="border border-red-500">
            <div dangerouslySetInnerHTML={{ __html: articleData.content }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
