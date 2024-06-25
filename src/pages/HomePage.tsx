import { useQuery } from 'react-query';
// --- components ---
import ArticleList from 'components/article/ArticleList';

// --- api / type ---
import { ArticleResultType, getPartialArticles } from '../api/article';
import { postResultType } from 'types/postType';
import { getAllPosts } from 'api/post';
import PostList from 'components/post/PostList';

function HomePage() {
  /** 取得文章 */
  // const articleQueryData = useQuery('articles', () => getPartialArticles(5)) as ArticleResultType;

  const postQueryData = useQuery('post', () => getAllPosts()) as postResultType;

  return (
    <div className="max-w-[600px] p-4 sm:p-0">
      {/* <ArticleList articleQueryData={articleQueryData} /> */}
      <PostList postQueryData={postQueryData} />

    </div>
  );
}

export default HomePage;
