import { useQuery } from 'react-query';
// --- components ---
import PostList from 'components/post/PostList';
// --- api / type ---
import { PostResultType } from 'types/postType';
import { getAllPosts, getPartialPosts } from 'api/post';
import { useDispatch } from 'react-redux';
import { setActivePage } from 'redux/sysSlice';
import { useEffect, useState } from 'react';
import PostListDynamic from 'components/post/PostListDynamic';
import PostListLoading from 'components/post/PostListLoading';
import { get, isEmpty } from 'lodash';

function HomePage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1); // (動態載入)目前呈現的post資料取得的index(頁碼)
  const [postList, setPostList] = useState(); // 儲存post資料
  /** 取得文章 */
  // const postListData = useQuery('homepagePost', () => getAllPosts()) as PostResultType;

  const postListData = useQuery('homepagePost', () => getPartialPosts(page)) as PostResultType;
  const { isLoading, data } = postListData;
  const posts = get(data, 'posts', []);

  // setTweetList((prevData) => {
  //   return prevData.map((item) => {
  //     if (item.id === new_data.id) {
  //       return {
  //         ...item,
  //         like_count:
  //           type === "like" ? item.like_count + 1 : item.like_count - 1,
  //         is_liked: type === "like" ? 1 : 0,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });
  // });

  useEffect(() => {
    // console.log(postListData);
    // if (postListData.isSuccess) {
    //   setPage(page + 1);
    // }

    dispatch(setActivePage('home'));
  }, [postListData.isLoading]);

  return (
    <div className="w-full max-w-[600px] p-1 sm:p-0">
      {/* <PostList postListData={postListData} /> */}
      <PostListDynamic postListData={postListData} isLoading={isLoading} />
    </div>
  );
}

export default HomePage;
