import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// --- components ---
import ArticleList from 'components/article/ArticleList';
import SideBar from 'components/SideBar';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';
import PageBanner from 'components/PageBanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchParam = searchParams.get('searchText');
  const [searchText, setSearchText] = useState(searchParam);

  /** 搜尋 */
  const handleSearch = (key: string) => {
    if (key === 'Enter') {
      console.log('executeing search');
    }
  };

  return (
    <div className="flex justify-between">
      <div className={SIDEBAR_FRAME}>
        <SideBar />
      </div>
      <div className={SIDEBAR_CONTAINER_FRAME}>
        <div className="max-w-[600px]">
          <PageBanner title="搜尋">
            <div className="relative flex items-center my-2">
              <input
                type="text"
                name="search"
                placeholder="搜尋..."
                onChange={(e) => setSearchText(e.target.value)}
                onKeyUp={(e) => handleSearch(e.key)}
                className="p-4 pl-10 w-full h-9 text-lg rounded-full bg-gray-200 dark:bg-gray-700 outline-none"
              />
              <FontAwesomeIcon
                icon={icon({ name: 'search', style: 'solid' })}
                className="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-gray-500 dark:text-gray-100"
              />
              {/* 清除搜尋字串 */}
              <FontAwesomeIcon
                icon={icon({ name: 'xmark', style: 'solid' })}
                onClick={() => setSearchText('')}
                className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
              />
            </div>
          </PageBanner>
          <ArticleList />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
