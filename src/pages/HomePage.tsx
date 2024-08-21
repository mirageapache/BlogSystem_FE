import { useQuery } from 'react-query';
// --- components ---
import PostList from 'components/post/PostList';
// --- api / type ---
import { PostResultType } from 'types/postType';
import { getAllPosts } from 'api/post';
import { useDispatch } from 'react-redux';
import { setActivePage } from 'redux/sysSlice';
import { useEffect } from 'react';

function HomePage() {
  const dispatch = useDispatch();
  /** 取得文章 */
  const postListData = useQuery('homepagePost', () => getAllPosts()) as PostResultType;

  useEffect(() => {
    dispatch(setActivePage('home'));
  },[]);

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostList postListData={postListData} />
    </div>
  );
}

export default HomePage;
