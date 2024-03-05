import { useQuery } from 'react-query';
// --- components ---
import ArticleList from 'components/article/ArticleList';

// --- api / type ---
import { apiResultType, getPartialArticles } from '../api/article';

function HomePage() {
  /** 取得文章 */
  const apiResult = useQuery('articles', () => getPartialArticles(5)) as apiResultType;

  return (
    <div className="max-w-[600px]">
      <ArticleList apiResult={apiResult} />
    </div>
  );
}

export default HomePage;
