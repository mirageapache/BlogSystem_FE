import { useQuery } from 'react-query';
// --- components ---
import PostListDynamic from 'components/post/PostListDynamic';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / type ---
import { PostDataType, PostResultType } from 'types/postType';
import { getPartialPosts } from 'api/post';
import { useDispatch } from 'react-redux';
import { setActivePage } from 'redux/sysSlice';
import { useEffect, useState } from 'react';
import { get, isEmpty } from 'lodash';

function HomePage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1); // (動態載入)目前呈現的post資料取得的index(頁碼)
  const [postList, setPostList] = useState<PostDataType[]>([]); // 儲存post資料

  /** 取得文章 */
  const postListData = useQuery('homepagePost', () => getPartialPosts(page)) as PostResultType;
  const { isLoading, data, refetch } = postListData;
  const posts = get(data, 'posts', []) as PostDataType[]; // 貼文資料
  const nextPage = get(data, 'nextPage', 1); // 下一頁指標，如果為「-1」表示最後一頁了

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; // 防止瀏覽器紀錄前一個滾動位置
    window.scrollTo(0, 0);
    dispatch(setActivePage('home'));
  }, []);

  useEffect(() => {
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

export default HomePage;
