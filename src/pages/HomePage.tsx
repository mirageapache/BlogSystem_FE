import { useQuery } from 'react-query';
// --- components ---
import ArticleList from 'components/article/ArticleList';
import SideBar from 'components/SideBar';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';
// --- api ---
import { ApiResultType } from '../api';
import { getPartialArticles } from '../api/article';

function HomePage() {

  /** 取得文章 */
  const apiResult = useQuery<ApiResultType>('posts', () => getPartialArticles(5));

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
