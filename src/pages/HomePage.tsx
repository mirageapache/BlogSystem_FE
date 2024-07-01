import { useQuery } from 'react-query';
// --- components ---
import PostList from 'components/post/PostList';
// --- api / type ---
import { postResultType } from 'types/postType';
import { getAllPosts } from 'api/post';

function HomePage() {
  /** 取得文章 */

  const postQueryData = useQuery('post', () => getAllPosts()) as postResultType;

  return (
    <div className="w-full max-w-[600px] p-4 sm:p-0">
      <PostList postQueryData={postQueryData} />
    </div>
  );
}

export default HomePage;
