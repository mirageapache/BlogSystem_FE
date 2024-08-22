import { isEmpty } from 'lodash';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import PostItem from './PostItem';
import BasicErrorPanel from '../../components/tips/BasicErrorPanel';
import PostListLoading from './PostListLoading';
// --- types ---
import { PostDataType, PostResultType } from '../../types/postType';

function PostList(props: { postListData: PostResultType }) {
  const { postListData } = props;
  const { isLoading, data } = postListData;
  const postDataList: PostDataType[] | null = data as PostDataType[] | null;

  if (isLoading) return <PostListLoading />;
  if (!isEmpty(data) && data.code === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg="與伺服器連線異常，請稍候再試！" />;
  if (isEmpty(postDataList))
    return <NoSearchResult msgOne="搜尋不到相關貼文" msgTwo="" type="post" />;

  const postItems = postDataList!.map((post) => {
    return <PostItem key={post._id} postData={post} />;
  });

  return <section className="w-full">{postItems}</section>;
}

export default PostList;
