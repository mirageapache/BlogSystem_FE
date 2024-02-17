import { useQuery } from 'react-query';
// --- components ---
import ArticleList from 'components/article/ArticleList';
import SideBar from 'components/SideBar';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';
// --- api / type ---
import { apiResultType, getPartialArticles } from '../api/article';

function HomePage() {

  /** 取得文章 */
  const apiResult = useQuery('articles', () => getPartialArticles(5)) as apiResultType;

  return (
    <div className="flex justify-between">
      <div className={SIDEBAR_FRAME}>
        <SideBar />
      </div>
      <div className={SIDEBAR_CONTAINER_FRAME}>
        <div className="max-w-[600px]">
          <ArticleList apiResult={apiResult} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
