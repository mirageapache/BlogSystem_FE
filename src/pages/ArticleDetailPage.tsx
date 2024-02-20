import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
// --- api ---
import { getPostById } from '../api/post';
// --- components ---
import AuthorInfoPanel  from '../components/user/AuthorInfoPanel';
import ArticleInfoPanel  from '../components/article/ArticleInfoPanel';
import ContentSection  from '../components/article/ContentSection';

function ArticleDetailPage() {
  const { id } = useParams();
  const avatarUrl = '';

  const { isLoading, error, data } = useQuery('posts', () => getPostById(id));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <div className="flex justify-center">
      <div className="flex flex-col max-w-[750px] m-5">
        <h2 className="text-4xl border-b-[1px] dark:border-gray-700 pb-4">{data.title}</h2>
        <div className="flex flex-col w-full">
          <div className="w-full">
            {/* 作者資訊 */}
            <AuthorInfoPanel avatarUrl={avatarUrl} />
            {/* 文章資訊 */}
            <ArticleInfoPanel />
          </div>
          {/* 文章內文 */}
          <ContentSection content={data.body}/>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
