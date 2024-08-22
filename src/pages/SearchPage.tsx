import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import ArticleList from 'components/article/ArticleList';
// --- functions / types ---
import { SearchStateType, setSearchText } from 'redux/searchSlice';
// --- api / type ---
import { getArticles, getSearchArticle } from 'api/article';
import { ArticleResultType } from 'types/articleType';
import { PostResultType } from 'types/postType';
import { getSearchPost } from 'api/post';
import { UserResultType } from 'types/userType';
import { getSearchUserList } from 'api/user';
import { getCookies } from 'utils/common';
import PostList from 'components/post/PostList';
import FollowList from 'components/user/FollowList';
import { FollowResultType } from 'types/followType';

/** stateType (SearchPage) */
interface stateType {
  search: SearchStateType;
}

function SearchPage() {
  const dispatch = useDispatch();
  const searchState = useSelector((state: stateType) => state.search);
  const { searchText } = searchState;
  const [searchString, setSearchString] = useState(searchText);
  const [articles, setArticles] = useState();
  const [posts, setPosts] = useState();
  const [users, setUsers] = useState();

  let articleListData: ArticleResultType | undefined;
  let postListData: PostResultType | undefined;
  let userListData: UserResultType | undefined;
  const userId = getCookies('uid');

  const articleQuery = useQuery(
    ['article', searchString],
    () => (isEmpty(searchString) ? getArticles() : getSearchArticle(searchString, '')),
    { enabled: !!searchString || isEmpty(searchString) }
  ) as ArticleResultType;

  const postQuery = useQuery(['post', searchString], () => getSearchPost(searchString, ''), {
    enabled: !!searchString,
  }) as PostResultType;

  const userQuery = useQuery(
    ['user', searchString],
    () => getSearchUserList(searchString, userId),
    { enabled: !!searchString }
  ) as FollowResultType;

  if (postListData !== undefined && userListData !== undefined) {
    console.log(postListData, userListData);
  }

  useEffect(() => {
    if (!isEmpty(searchString)) {
      articleQuery.refetch();
      postQuery.refetch();
      userQuery.refetch();
    }
  }, [searchString]);

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
              dispatch(setSearchText(''));
            }}
            className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="max-w-[600px]">
          {isEmpty(searchString) ? (
            <div>探索新主題</div>
          ) : (
            <>
              <ArticleList articleListData={articleQuery} />
              {/* <PostList postListData={postQuery} /> */}
              {/* <FollowList type='userList' followList={userQuery} /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
