// --- components ---
import ArticleList from 'components/article/ArticleList';
import SideBar from 'components/SideBar';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';

function HomePage() {
  return (
    <div className="flex justify-between">
      <div className={SIDEBAR_FRAME}>
        <SideBar />
      </div>
      <div className={SIDEBAR_CONTAINER_FRAME}>
        <div className="max-w-[600px]">
          <ArticleList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
