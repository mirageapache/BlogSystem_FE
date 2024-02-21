import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import ArticleList from 'components/article/ArticleList';
import SideBar from 'components/SideBar';
import PageBanner from 'components/PageBanner';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';
// --- functions / types ---
import { SearchStateType, setSearchText } from '../redux/searchSlice';
// --- api / type ---
import { apiResultType, getSearchArticle } from '../api/article';

/** stateType (SearchPage) */
interface stateType {
  search: SearchStateType;
}

function SearchPage() {
  const dispatch = useDispatch();
  const searchState = useSelector((state: stateType) => state.search);
  const { searchText } = searchState;
  const [apiResult, setApiResult] = useState<apiResultType>({
    isLoading: true,
    error: null,
    data: null,
  });

  /** 搜尋 */
  const getSearchResult = async (searchString: string) => {
    const result = await getSearchArticle(searchString);
    setApiResult({
      isLoading: false,
      error: null,
      data: result,
    });
  };

  useEffect(() => {
    if (isEmpty(apiResult.data)) {
      getSearchResult(searchText);
    }
  }, []);

  return (
    <div className="flex justify-between">
      <div className={SIDEBAR_FRAME}>
        <SideBar />
      </div>
      <div className={SIDEBAR_CONTAINER_FRAME}>
        <div className="max-w-[600px]">
          <PageBanner title="搜尋">
            <div className="relative flex items-center min-w-[600px] my-2">
              <input
                type="text"
                name="search"
                placeholder="搜尋..."
                value={searchText}
                onChange={(e) => {
                  dispatch(setSearchText(e.target.value));
                  getSearchResult(e.target.value);
                }}
                className="p-4 pl-10 w-full h-9 text-lg rounded-full bg-gray-200 dark:bg-gray-700 outline-none"
              />
              <FontAwesomeIcon
                icon={icon({ name: 'search', style: 'solid' })}
                className="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-gray-500 dark:text-gray-100"
              />
              {/* 清除搜尋字串 */}
              <FontAwesomeIcon
                icon={icon({ name: 'xmark', style: 'solid' })}
                onClick={() => {
                  dispatch(setSearchText(''));
                  getSearchResult('');
                }}
                className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
              />
            </div>
          </PageBanner>
          <ArticleList apiResult={apiResult} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
