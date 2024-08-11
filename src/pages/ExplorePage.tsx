import React, { useEffect, useState } from 'react';
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
import { getAllPosts } from '../api/post';
import { getRecommendUserList, getSearchUserList } from '../api/user';
import { getSearchArticle, getArticles } from '../api/article';
import { ArticleResultType } from '../types/articleType';
import { PostResultType } from '../types/postType';
import { SysStateType, setExploreTag } from '../redux/sysSlice';

/** stateType (SearchPage) */
interface stateType {
  search: SearchStateType;
  system: SysStateType;
}

function ExplorePage() {
  const [activeUnderLine, setActiveUnderLine] = useState(''); // 頁籤樣式控制
  const dispatch = useDispatch();
  const searchState = useSelector((state: stateType) => state.search);
  const { searchText } = searchState; // 搜尋字串
  const systemState = useSelector((state: stateType) => state.system);
  const { exploreTag } = systemState; // 紀錄作用中的頁籤
  const userId = getCookies('uid'); // 使用者id (判斷是否登入)
  const iconStyle = 'text-gray-500 md:hidden py-1'; // 頁籤通用樣式
  const activeTabStyle = 'text-orange-500'; // 頁籤控制
  let articleQueryData: ArticleResultType;
  let postQueryData: PostResultType;
  let userList: FollowResultType;

  switch (exploreTag) {
    case 'popular':
      articleQueryData = useQuery('articles', () => getArticles()) as ArticleResultType;
      break;
    case 'article':
      /** 取得文章資料 */
      articleQueryData = useQuery('articles', () => getArticles()) as ArticleResultType;
      break;
    case 'post':
      postQueryData = useQuery('post', () => getAllPosts()) as PostResultType;
      break;
    case 'user':
      /** 取得用戶清單 */
      userList = useQuery('followList', () => getRecommendUserList(userId)) as FollowResultType;
      break;
    // case 'tag':
    //   break;
    default:
      articleQueryData = useQuery('articles', () => getArticles()) as ArticleResultType;
      break;
  }

  useEffect(() => {
    switch (exploreTag) {
      case 'popular':
        setActiveUnderLine('translate-x-0');
        break;
      case 'article':
        setActiveUnderLine('translate-x-full');
        break;
      case 'post':
        setActiveUnderLine('translate-x-[200%]');
        break;
      case 'user':
        setActiveUnderLine('translate-x-[300%]');
        break;
      case 'tag':
        setActiveUnderLine('translate-x-[400%]');
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
      <div className="flex justify-center py-1">
        {/* 頁籤 */}
        <div className="w-full max-w-[600px]">
          <div className="text-lg flex border-b-[1px] border-gray-400 dark:text-gray-400">
            <button
              type="button"
              className="flex w-1/5 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('popular')}
            >
              <p className="hidden md:inline-block">熱門</p>
              <FontAwesomeIcon
                icon={icon({ name: 'fire', style: 'solid' })}
                className={`${iconStyle} ${exploreTag === 'popular' ? activeTabStyle : ''}`}
              />
            </button>
            <button
              type="button"
              className="flex w-1/5 justify-center py-1.5 hover:cursor-pointer outline-none"
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
              className="flex w-1/5 justify-center py-1.5 hover:cursor-pointer outline-none"
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
              className="flex w-1/5 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('user')}
            >
              <p className="hidden md:inline-block">用戶</p>
              <FontAwesomeIcon
                icon={icon({ name: 'users', style: 'solid' })}
                className={`${iconStyle} ${exploreTag === 'user' ? activeTabStyle : ''}`}
              />
            </button>
            <button
              type="button"
              className="flex w-1/5 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('tag')}
            >
              <p className="hidden md:inline-block">標籤</p>
              <FontAwesomeIcon
                icon={icon({ name: 'tag', style: 'solid' })}
                className={`${iconStyle} ${exploreTag === 'tag' ? activeTabStyle : ''}`}
              />
            </button>
          </div>
          <div className="flex justify-start -translate-y-0.5">
            <div
              className={`border-b-[3px] border-orange-500 w-1/5 text-transparent ${activeUnderLine} transform duration-300 ease-in-out`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {/* 熱門 */}
        {exploreTag === 'popular' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ArticleList articleListData={articleQueryData!} />
          </section>
        )}
        {/* 文章 */}
        {exploreTag === 'article' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ArticleList articleListData={articleQueryData!} />
          </section>
        )}
        {/* 貼文 */}
        {exploreTag === 'post' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <PostList postQueryData={postQueryData!} />
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
