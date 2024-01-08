import { useQuery } from 'react-query';
import { get } from 'lodash';
import PostItem from './PostItem';
import { getTopTenPosts } from '../../api/post';

interface PostType {
  body: string;
  id: number;
  reactions: number;
  tags: string[];
  title: string;
  userId: number;
}

function PostList() {
  const { isLoading, error, data } = useQuery('posts', getTopTenPosts);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  const postList: PostType[] = get(data, 'posts', []);
  const postItems = postList.map((post) => (
    <PostItem key={post.id} id={post.id} title={post.title} body={post.body} tags={post.tags} />
  ));

  return <div className="flex-grow">{postItems}</div>;
}

export default PostList;
