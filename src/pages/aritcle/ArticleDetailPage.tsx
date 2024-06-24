import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
// --- api ---
import { getAllPosts } from '../../api/post';
// --- components ---
import UserInfoPanel from '../../components/user/UserInfoPanel';
import ArticleInfoPanel from '../../components/article/ArticleInfoPanel';
import ContentSection from '../../components/article/ContentSection';
import Spinner from '../../components/tips/Spinner';

function ArticleDetailPage() {
  const { id } = useParams();
  const avatarUrl = '';

  // const { isLoading, error, data } = useQuery('posts', () => getAllPosts());

  // if (isLoading) return <Spinner />;
  // if (error) return <p>Error</p>;
  return (
    <div className="flex justify-center">
      <div className="flex flex-col max-w-[750px] m-5">
        <h2 className="text-4xl border-b-[1px] dark:border-gray-700 pb-4">文章標題</h2>
        <div className="flex flex-col w-full">
          <div className="w-full">
            {/* 作者資訊 */}
            <UserInfoPanel
              userId=""
              account=""
              name=""
              avatarUrl={avatarUrl}
              bgColor=""
              className="my-4"
            />
            {/* 文章資訊 */}
            <ArticleInfoPanel />
          </div>
          {/* 文章內文 */}
          <ContentSection content="文章內容" />
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
