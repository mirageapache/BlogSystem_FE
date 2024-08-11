import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import ArticleList from 'components/article/ArticleList';
// --- functions / types ---
import { SearchStateType, setSearchText } from '../redux/searchSlice';
// --- api / type ---
import { getArticles, getSearchArticle } from '../api/article';
import { ArticleResultType } from '../types/articleType';

/** stateType (SearchPage) */
interface stateType {
  search: SearchStateType;
}

function SearchPage() {
  const dispatch = useDispatch();
  const searchState = useSelector((state: stateType) => state.search);
  const { searchText } = searchState;
  const [searchString, setSearchString] = useState(searchText);
  let articleListData: ArticleResultType;
  const queryKey = useMemo(() => ['article', searchString], [searchString]); // 使用useMemo同步state的狀態

  /** 預設先呈現文章 */
  if (isEmpty(searchString)) {
    articleListData = useQuery(queryKey, () => getArticles()) as ArticleResultType;
  } else {
    // 搜尋 Article 文章資料
    articleListData = useQuery(queryKey, () => getSearchArticle(searchString, ''), {
      enabled: false, // 禁用初始自動查詢
    }) as ArticleResultType;
  }

  const { refetch } = articleListData;

  useEffect(() => {
    refetch();
  }, [searchString, refetch]);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="relative flex items-center my-2 max-w-[600px]">
          <input
            type="text"
            name="search"
            placeholder="搜尋..."
            value={searchString}
            onChange={(e) => {
              // handle search text change
              setSearchString(e.target.value);
              refetch();
              dispatch(setSearchText(e.target.value));
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
              setSearchString('');
              refetch();
              dispatch(setSearchText(''));
            }}
            className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="max-w-[600px]">
          <ArticleList articleListData={articleListData} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
