import { useQuery } from 'react-query';
// --- components ---
import ArticleList from 'components/article/ArticleList';

// --- api / type ---
import { ArticleResultType, getPartialArticles } from '../api/article';

function HomePage() {
  /** 取得文章 */
  const apiResult = useQuery('articles', () => getPartialArticles(5)) as ArticleResultType;

  return (
    <div className="max-w-[600px] p-4 sm:p-0">
      <ArticleList apiResult={apiResult} />
    </div>
  );
}

export default HomePage;
