import PostList from 'components/post/PostList';
import SideBar from 'components/SideBar';

function HomePage() {
  return (
    <div className="flex justify-between">
      <div className="fixed hidden sm:block sm:w-20 lg:w-60 p-3">
        <SideBar />
      </div>
      <div className="w-full sm:ml-20 lg:ml-60 p-5 border-l-[1px] border-gray-200 dark:border-gray-700">
        <PostList />
      </div>
    </div>
  );
}

export default HomePage;
