import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import ArticleList from 'components/article/ArticleList';
import PageBanner from 'components/layout/PageBanner';
// --- functions / types ---
import { SearchStateType, setSearchText } from '../redux/searchSlice';
// --- api / type ---
import { ArticleResultType, getSearchArticle } from '../api/article';

/** stateType (SearchPage) */
interface stateType {
  search: SearchStateType;
}

function SearchPage() {
  const dispatch = useDispatch();
  const searchState = useSelector((state: stateType) => state.search);
  const { searchText } = searchState;

  // Article 文章資料
  const articleQueryData = useQuery('aritcleList', () => getSearchArticle(searchText), {
    enabled: false, // 禁用初始自動查詢
  }) as ArticleResultType;

  console.log(articleQueryData);

  const { refetch } = articleQueryData;
  // handle search text change
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(e.target.value));
    refetch(); // 重新發起查詢
  };

  return (
    <div className="max-w-[600px]">
      <PageBanner title="搜尋" classname="flex justify-center">
        <div className="relative flex items-center w-4/5 md:max-w-[480px] my-2">
          <input
            type="text"
            name="search"
            placeholder="搜尋..."
            value={searchText}
            onChange={(e) => {
              dispatch(setSearchText(e.target.value));
              handleSearchTextChange(e);
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
              refetch(); // 清除搜尋字串後重新發起查詢
            }}
            className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
          />
        </div>
      </PageBanner>
      <ArticleList articleQueryData={articleQueryData} />
    </div>
  );
}

export default SearchPage;
