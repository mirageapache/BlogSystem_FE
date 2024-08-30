import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
// --- components ---
import PostListDynamic from 'components/post/PostListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / type ---
import { PostDataType, PostResultType } from 'types/postType';
import { getPartialPosts, getSearchPost } from 'api/post';
import { useSearchParams } from 'react-router-dom';

function ExplorePost() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.get('search') || ''; // 取得搜尋字串
  const [page, setPage] = useState(1); // (動態載入)目前呈現的post資料取得的index(頁碼)
  const [postList, setPostList] = useState<PostDataType[]>([]); // 儲存post資料
  const [preSearch, setPreSearch] = useState(''); // 紀錄前一個搜尋字串，用來判斷searchString是否變動
  const fetchPage = searchString !== preSearch ? 1 : page; // 判斷搜尋字串不同

  console.log('searchString = ', searchString, 'preSearch = ', preSearch);
  console.log(isEmpty(searchString));

  /** 取得文章 */
  // const postListData = useQuery('homepagePost', () => getPartialPosts(page)) as PostResultType;
  const postListData = useQuery('explorePost', () =>
    isEmpty(searchString) || searchString.length === 0
      ? getPartialPosts(fetchPage)
      : getSearchPost(searchString, '', fetchPage)
  ) as PostResultType;
  const { isLoading, data, refetch } = postListData;
  const posts = get(data, 'posts', []) as PostDataType[]; // 貼文資料
  const nextPage = get(data, 'nextPage', 1); // 下一頁指標，如果為「-1」表示最後一頁了

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setPostList([]);
    setPage(1);
  }, [searchString]);

  useEffect(() => {
    if (searchString) setPreSearch(searchString);
    if (!isEmpty(posts)) {
      setPostList((prevData) => [...prevData, ...posts]);
      setPage(nextPage);
    }
  }, [nextPage]);

  /** 滾動判斷fetch新資料 */
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (page > 0) refetch();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isEmpty(data) && data.code === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg="與伺服器連線異常，請稍候再試！" />;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostListDynamic postListData={postList} isLoading={isLoading} atBottom={page < 0} />
    </div>
  );
}

export default ExplorePost;
