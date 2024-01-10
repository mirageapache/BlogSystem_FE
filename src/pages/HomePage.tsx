import PostList from 'components/post/PostList';
import SideBar from 'components/homepage/SideBar';

function HomePage() {
  return (
    <div className="flex w-full my-5">
      <SideBar />
      <PostList />
    </div>
  );
}

export default HomePage;
