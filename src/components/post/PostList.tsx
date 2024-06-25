import { get, isEmpty } from 'lodash';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import PostItem from './PostItem';
import BasicErrorPanel from '../../components/tips/BasicErrorPanel';
import ArticleLoading from '../article/ArticleLoading';
// --- types ---
import { PostDataType, postResultType } from '../../types/postType';

function PostList(props: { postQueryData: postResultType }) {
  const { postQueryData } = props;
  const { isLoading, data } = postQueryData;
  const postDataList: PostDataType[] | null = data as PostDataType[] | null;

  if (true) return <ArticleLoading />;
  if (data!.code === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg="與伺服器連線異常，請稍候再試！" />;
  if (isEmpty(postDataList))
    return <NoSearchResult msgOne="找不到任何貼文！!" msgTwo=" " type="post" />;

  const postItems = postDataList!.map((post) => {
    return <PostItem key={post._id} postData={post} />;
  });

  return <section className="flex-grow">{postItems}</section>;
}

export default PostList;
