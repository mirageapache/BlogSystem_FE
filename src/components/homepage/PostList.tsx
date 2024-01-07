import PostItem from './PostItem';

function PostList() {
  return (
    <div className="flex-grow">
      <PostItem />
      <PostItem />
      <PostItem />
    </div>
  );
}

export default PostList;
