import { useQuery } from 'react-query';
import { get } from 'lodash';
import PostItem from './PostItem';
import { getPostByLimit } from '../../api/post';

interface PostType {
  body: string;
  id: number;
  reactions: number;
  tags: string[];
  title: string;
  userId: number;
}

function PostList() {
  const { isLoading, error, data } = useQuery('posts', () => getPostByLimit(5));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  const postList: PostType[] = get(data, 'posts', []);
  const postItems = postList.map((post) => (
    <PostItem key={post.id} id={post.id} title={post.title} body={post.body} tags={post.tags} />
  ));

  return <div className="flex-grow px-8 md:px-0">{postItems}</div>;
}

export default PostList;
