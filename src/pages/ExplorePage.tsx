import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { faSearch, faTag, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFileLines, faNoteSticky } from '@fortawesome/free-regular-svg-icons';
// --- components ---
import ExplorePost from 'components/explore/ExplorePost';
import ExploreArticle from 'components/explore/ExploreArticle';
import ExploreHashTag from 'components/explore/ExploreHashTag';
import ExploreUser from 'components/explore/ExploreUser';
// --- api / type ---
import { checkLogin } from 'utils/common';
import { getSearchCount } from 'api';
import { SysStateType, setActivePage, setExploreTag } from '../redux/sysSlice';

/** stateType (SearchPage) */
interface stateType {
  system: SysStateType;
}

/** 頁籤底線位移樣式 — 依 exploreTag 查表，避免用 useEffect + setState 推導 */
const UNDERLINE_MAP: Record<string, string> = {
  article: 'translate-x-0',
  post: 'translate-x-full',
  user: 'translate-x-[200%]',
  tag: 'translate-x-[300%]',
};

function ExplorePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || ''; // 取得搜尋字串
  const tabButtonStyle =
    'relative flex w-1/4 justify-center items-center py-1.5 hover:cursor-pointer outline-none transition-colors'; // 頁籤按鈕樣式
  const iconStyle = 'text-muted md:hidden py-1'; // 頁籤通用樣式
  const activeTabStyle = 'text-brand'; // 頁籤控制
  const countSpanStyle =
    'sm:absolute sm:right-5 md:right-4 hidden sm:inline-block text-[12px] leading-5 px-3 bg-brand text-white rounded-full'; // 數量標籤樣式
  const countDotStyle = 'block sm:hidden absolute top-2 ml-8 w-2 h-2 bg-brand rounded-full'; // 標籤點樣式

  /** 頁籤切換 */
  const handleTabActive = (tabValue: string) => {
    dispatch(setExploreTag(tabValue));
  };
  const { tag } = useParams();
  // Hook 必須無條件呼叫；tag 存在時優先用 URL 上的值，否則用 redux store 內紀錄
  const exploreTagFromStore = useSelector((state: stateType) => state.system.exploreTag);
  const exploreTag = !isEmpty(tag) ? tag! : exploreTagFromStore;

  // URL 上的 tag 改變時同步到 redux（不可在 render 期直接 dispatch）
  useEffect(() => {
    if (!isEmpty(tag)) dispatch(setExploreTag(tag!));
  }, [tag]);

  const { data } = useQuery({
    queryKey: ['search', searchString],
    queryFn: () => getSearchCount(searchString),
  });
  const article = get(data, 'article', 0);
  const post = get(data, 'post', 0);
  let user = get(data, 'user', 0);
  if (checkLogin()) user -= 1; // 有登入須扣除自己
  const hashtag = get(data, 'hashtag', 0);

  useEffect(() => {
    dispatch(setActivePage('explore'));
  }, []);

  useEffect(() => {
    if (!isEmpty(searchString) && data) {
      // 切換到有數據的頁籤
      const currentTabHasData =
        (exploreTag === 'article' && article > 0) ||
        (exploreTag === 'post' && post > 0) ||
        (exploreTag === 'user' && user > 0) ||
        (exploreTag === 'tag' && hashtag > 0);

      if (!currentTabHasData) {
        if (article > 0) {
          handleTabActive('article');
        } else if (post > 0) {
          handleTabActive('post');
        } else if (user > 0) {
          handleTabActive('user');
        } else if (hashtag > 0) {
          handleTabActive('tag');
        }
      }
    }
  }, [data, searchString]);

  const activeUnderLine = UNDERLINE_MAP[exploreTag] ?? UNDERLINE_MAP.article;

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
            autoComplete="off"
            onChange={(e) => {
              if (isEmpty(e.target.value)) {
                navigate('/explore');
              } else {
                setSearchParams({ search: e.target.value });
              }
            }}
            className="p-4 pl-10 w-full h-9 text-lg rounded-full bg-surface-2 border border-line text-ink placeholder:text-muted outline-none focus-visible:outline-none focus:rounded-full focus:border-brand transition-colors"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-muted"
          />
          {/* 清除搜尋字串 */}
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => {
              navigate(`/explore`);
            }}
            className="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-muted hover:text-ink transition-colors cursor-pointer"
          />
        </div>

        {/* 頁籤 */}
        <div className="w-full max-w-[600px]">
          <div className="text-lg flex border-b border-line text-ink-soft">
            <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('article')}
            >
              <p
                className={`hidden md:inline-block ${exploreTag === 'article' ? activeTabStyle : ''}`}
              >
                文章
              </p>
              <FontAwesomeIcon
                icon={faFileLines}
                className={`${iconStyle} ${exploreTag === 'article' ? activeTabStyle : ''}`}
              />
              {!isEmpty(searchString) && article > 0 && (
                <>
                  <span className={countSpanStyle}>{article}</span>
                  <span className={countDotStyle} />
                </>
              )}
            </button>
            <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('post')}
            >
              <p
                className={`hidden md:inline-block ${exploreTag === 'post' ? activeTabStyle : ''}`}
              >
                貼文
              </p>
              <FontAwesomeIcon
                icon={faNoteSticky}
                className={`${iconStyle} ${exploreTag === 'post' ? activeTabStyle : ''}`}
              />
              {!isEmpty(searchString) && post > 0 && (
                <>
                  <span className={countSpanStyle}>{post}</span>
                  <span className={countDotStyle} />
                </>
              )}
            </button>
            <button
              type="button"
              className={tabButtonStyle}
              onClick={() => handleTabActive('user')}
            >
              <p
                className={`hidden md:inline-block ${exploreTag === 'user' ? activeTabStyle : ''}`}
              >
                用戶
              </p>
              <FontAwesomeIcon
                icon={faUsers}
                className={`${iconStyle} ${exploreTag === 'user' ? activeTabStyle : ''}`}
              />
              {!isEmpty(searchString) && user > 0 && (
                <>
                  <span className={countSpanStyle}>{user}</span>
                  <span className={countDotStyle} />
                </>
              )}
            </button>
            <button type="button" className={tabButtonStyle} onClick={() => handleTabActive('tag')}>
              <p className={`hidden md:inline-block ${exploreTag === 'tag' ? activeTabStyle : ''}`}>
                標籤
              </p>
              <FontAwesomeIcon
                icon={faTag}
                className={`${iconStyle} ${exploreTag === 'tag' ? activeTabStyle : ''}`}
              />
              {!isEmpty(searchString) && hashtag > 0 && (
                <>
                  <span className={countSpanStyle}>{hashtag}</span>
                  <span className={countDotStyle} />
                </>
              )}
            </button>
          </div>
          <div className="flex justify-start -translate-y-0.5">
            <div
              className={`border-b-[3px] border-brand w-1/4 text-transparent ${activeUnderLine} transform duration-300 ease-in-out`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {/* 文章 */}
        {exploreTag === 'article' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ExploreArticle />
          </section>
        )}
        {/* 貼文 */}
        {exploreTag === 'post' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ExplorePost />
          </section>
        )}
        {/* 用戶 */}
        {exploreTag === 'user' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ExploreUser />
          </section>
        )}
        {/* 標籤 */}
        {exploreTag === 'tag' && (
          <section className="flex justify-center w-full max-w-[600px]">
            <ExploreHashTag />
          </section>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
