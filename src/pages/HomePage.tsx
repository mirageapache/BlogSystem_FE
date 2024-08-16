import { useQuery } from 'react-query';
// --- components ---
import PostList from 'components/post/PostList';
// --- api / type ---
import { PostResultType } from 'types/postType';
import { getAllPosts } from 'api/post';

function HomePage() {
  /** 取得文章 */

  const postListData = useQuery('post', () => getAllPosts()) as PostResultType;

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      <PostList postListData={postListData} />
    </div>
  );
}

export default HomePage;
