import { useQuery } from 'react-query';
import { get } from 'lodash';
import PostItem from './PostItem';
import { postResultType } from '../../types/postType';

interface PostType {
  body: string;
  id: number;
  reactions: number;
  tags: string[];
  title: string;
  userId: number;
}

function PostList(props: { postQueryData: postResultType }) {
  const { postQueryData } = props;
  const { isLoading, error, data } = postQueryData;

  console.log(data);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  const postList: PostType[] = get(data, 'posts', []);
  const postItems = postList.map((post) => (
    <PostItem key={post.id} id={post.id} title={post.title} body={post.body} tags={post.tags} />
  ));

  return <div className="flex-grow px-8 md:px-0">{postItems}</div>;
}

export default PostList;
