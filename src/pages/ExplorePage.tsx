import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
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
import { getUserList } from '../api/user';
import { getPartialArticles, ArticleResultType, getSearchArticle } from '../api/article';
import { postResultType } from '../types/postType';

/** stateType (SearchPage) */
interface stateType {
  search: SearchStateType;
}

function ExplorePage() {
  // 探索頁包含 文章、貼文、用戶等資料可瀏覽，並結合搜尋功能
  // 類別：熱門、文章、貼文、用戶(帳號)、標籤(文章或貼文)
  const [activeTab, setActiveTab] = useState('post'); // 頁籤控制
  const [activeUnderLine, setActiveUnderLine] = useState(''); // 頁籤樣式控制
  const searchState = useSelector((state: stateType) => state.search);
  const { searchText } = searchState; // 搜尋字串
  const userId = getCookies('uid'); // 使用者id (判斷是否登入)
  const iconStyle = 'text-gray-500 md:hidden py-1'; // 頁籤通用樣式
  const activeTabStyle = 'text-orange-500'; // 頁籤控制
  let articleQueryData: ArticleResultType;
  let postQueryData: postResultType;
  let userList: FollowResultType;

  switch (activeTab) {
    case 'popular':
      articleQueryData = useQuery('articles', () => getPartialArticles(5)) as ArticleResultType;
      break;
    case 'article':
      /** 取得文章資料 */
      if (isEmpty(searchText)) {
        articleQueryData = useQuery('articles', () => getPartialArticles(5)) as ArticleResultType;
      } else {
        // 搜尋 Article 文章資料
        articleQueryData = useQuery('aritcleList', () => getSearchArticle(searchText), {
          enabled: false, // 禁用初始自動查詢
        }) as ArticleResultType;
      }
      break;
    case 'post':
      postQueryData = useQuery('post', () => getAllPosts()) as postResultType;
      break;
    case 'user':
      /** 取得用戶清單 */
      userList = useQuery('followList', () => getUserList(searchText, userId)) as FollowResultType;
      break;
    // case 'tag':
    //   break;
    default:
      articleQueryData = useQuery('articles', () => getPartialArticles(5)) as ArticleResultType;
      break;
  }

  /** 頁籤切換 */
  const handleTabActive = (tabValue: string) => {
    setActiveTab(tabValue);
    switch (tabValue) {
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
                className={`${iconStyle} ${activeTab === 'popular' ? activeTabStyle : ''}`}
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
                className={`${iconStyle} ${activeTab === 'article' ? activeTabStyle : ''}`}
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
                className={`${iconStyle} ${activeTab === 'post' ? activeTabStyle : ''}`}
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
                className={`${iconStyle} ${activeTab === 'user' ? activeTabStyle : ''}`}
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
                className={`${iconStyle} ${activeTab === 'tag' ? activeTabStyle : ''}`}
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
        {activeTab === 'popular' && (
          <section className="w-full max-w-[600px]">
            <ArticleList articleQueryData={articleQueryData!} />
          </section>
        )}
        {/* 文章 */}
        {activeTab === 'article' && (
          <section className="w-full max-w-[600px]">
            <ArticleList articleQueryData={articleQueryData!} />
          </section>
        )}
        {/* 貼文 */}
        {activeTab === 'post' && (
          <section className="w-full max-w-[600px]">
            <PostList postQueryData={postQueryData!} />
          </section>
        )}
        {/* 用戶 */}
        {activeTab === 'user' && (
          <section className="w-full max-w-[600px]">
            <FollowList type="userList" followList={userList!} />
          </section>
        )}
        {/* 標籤 */}
        {activeTab === 'tag' && (
          <section className="w-full max-w-[600px]">
            <div>還沒有標籤資料</div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
