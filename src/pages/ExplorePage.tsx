import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- components ---
import ArticleList from 'components/article/ArticleList';
import PostList from 'components/post/PostList';
import FollowList from 'components/user/FollowList';

// --- functions / types ---
import { getCookies } from 'utils/common';
import { FollowResultType } from 'types/followType';
import { SearchStateType } from '../redux/searchSlice';

// --- api / type ---
import { getAllPosts, getSearchPost } from '../api/post';
import { getAllUserList, getRecommendUserList, getSearchUserList } from '../api/user';
import { getSearchArticle, getArticles } from '../api/article';
import { ArticleResultType } from '../types/articleType';
import { PostResultType } from '../types/postType';
import { SysStateType, setExploreTag } from '../redux/sysSlice';

/** stateType (SearchPage) */
interface stateType {
  system: SysStateType;
}

function ExplorePage() {
  const [activeUnderLine, setActiveUnderLine] = useState(''); // 頁籤樣式控制
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCookies('uid'); // 目前登入的使用者id (判斷追蹤狀態)
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || ''; // 取得搜尋字串
  const exploreTag = useSelector((state: stateType) => state.system.exploreTag); // 紀錄作用中的頁籤
  const tabButtonStyle = 'flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none'; // 頁籤按鈕樣式
  const iconStyle = 'text-gray-500 md:hidden py-1'; // 頁籤通用樣式
  const activeTabStyle = 'text-orange-500'; // 頁籤控制
  let articleListData: ArticleResultType;
  let postListData: PostResultType;
  let userList: FollowResultType;

  /** 取得文章資料 */
  articleListData = useQuery(
    ['article', searchString],
    () => (isEmpty(searchString) ? getArticles() : getSearchArticle(searchString, '')),
    { enabled: !!searchString || isEmpty(searchString) }
  ) as ArticleResultType;
  /** 取得貼文資料 */
  postListData = useQuery(
    ['post', searchString],
    () => (isEmpty(searchString) ? getAllPosts() : getSearchPost(searchString, '')),
    {
      enabled: !!searchString,
    }
  ) as PostResultType;
  /** 取得用戶清單 */
  userList = useQuery(
    ['user', searchString],
    () => isEmpty(searchString) ? getAllUserList() : getSearchUserList(searchString, currentUser),
    { enabled: !!searchString }
  ) as FollowResultType;

  useEffect(() => {
    switch (exploreTag) {
      // case 'popular':
      //   setActiveUnderLine('translate-x-0');
      //   break;
      case 'article':
        articleListData.refetch();
        setActiveUnderLine('translate-x-0');
        break;
      case 'post':
        postListData.refetch();
        setActiveUnderLine('translate-x-full');
        break;
      case 'user':
        userList.refetch();
        setActiveUnderLine('translate-x-[200%]');
        break;
      case 'tag':
        setActiveUnderLine('translate-x-[300%]');
        break;
      default:
        setActiveUnderLine('translate-x-0');
    }
  }, [exploreTag]);

  /** 頁籤切換 */
  const handleTabActive = (tabValue: string) => {
    dispatch(setExploreTag(tabValue));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center py-1">
        {/* 搜尋框 */}
        <div className="relative flex items-center my-2 w-full max-w-[400px]">
          <input
            type="text"
            name="search"
            placeholder="搜尋..."
            value={searchString}
            onChange={(e) => {
              if (isEmpty(e.target.value)) {
                navigate('/explore');
              } else {
                setSearchParams({ search: e.target.value });
              }
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
              navigate(`/explore`);
            }}
            className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
          />
        </div>

        {/* 頁籤 */}
        <div className="w-full max-w-[600px]">
          <div className="text-lg flex border-b-[1px] border-gray-400 dark:text-gray-400">
            {/* <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('popular')}
            >
              <p className="hidden md:inline-block">熱門</p>
              <FontAwesomeIcon
                icon={icon({ name: 'fire', style: 'solid' })}
                className={`${iconStyle} ${exploreTag === 'popular' ? activeTabStyle : ''}`}
              />
            </button> */}
            <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('article')}
            >
              <p className="hidden md:inline-block">文章</p>
              <FontAwesomeIcon
                icon={icon({ name: 'file-lines', style: 'regular' })}
                className={`${iconStyle} ${exploreTag === 'article' ? activeTabStyle : ''}`}
              />
            </button>
            <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('post')}
            >
              <p className="hidden md:inline-block">貼文</p>
              <FontAwesomeIcon
                icon={icon({ name: 'note-sticky', style: 'regular' })}
                className={`${iconStyle} ${exploreTag === 'post' ? activeTabStyle : ''}`}
              />
            </button>
            <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('user')}
            >
              <p className="hidden md:inline-block">用戶</p>
              <FontAwesomeIcon
                icon={icon({ name: 'users', style: 'solid' })}
                className={`${iconStyle} ${exploreTag === 'user' ? activeTabStyle : ''}`}
              />
            </button>
            <button type="button" className={tabButtonStyle} onClick={() => handleTabActive('tag')}>
              <p className="hidden md:inline-block">標籤</p>
              <FontAwesomeIcon
                icon={icon({ name: 'tag', style: 'solid' })}
                className={`${iconStyle} ${exploreTag === 'tag' ? activeTabStyle : ''}`}
              />
            </button>
          </div>
          <div className="flex justify-start -translate-y-0.5">
            <div
              className={`border-b-[3px] border-orange-500 w-1/4 text-transparent ${activeUnderLine} transform duration-300 ease-in-out`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {/* 熱門 */}
        {/* {exploreTag === 'popular' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ArticleList articleListData={articleListData!} />
          </section>
        )} */}
        {/* 文章 */}
        {exploreTag === 'article' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ArticleList articleListData={articleListData!} />
          </section>
        )}
        {/* 貼文 */}
        {exploreTag === 'post' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <PostList postListData={postListData!} />
          </section>
        )}
        {/* 用戶 */}
        {exploreTag === 'user' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <FollowList type="userList" followList={userList!} />
          </section>
        )}
        {/* 標籤 */}
        {exploreTag === 'tag' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <div>還沒有標籤資料</div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
