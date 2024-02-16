import { useQuery } from 'react-query';
import { get, isEmpty } from 'lodash';
// --- components ---
import ArticleItem from './ArticleItem';
import Loading from './Loading';
// --- api ---
import { ApiResultType } from '../../api';

/** articleList 型別 */
interface ArticleListType {
  body: string;
  id: number;
  reactions: number;
  tags: string[];
  title: string;
  userId: number;
}

function ArticleList(props:{ apiResult: ApiResultType}) {
  const { isLoading, error, data } = props.apiResult;
  // const { isLoading, error, data } = useQuery('posts', () => getPostByLimit(5));

  if (isLoading) return <Loading />;
  if (!isEmpty(error)) return <p>{error.message}</p>;
  const articleList: ArticleListType[] = get(data, 'posts', []);
  const articleItem = articleList.map((article) => (
    <ArticleItem
      key={article.id}
      id={article.id}
      title={article.title}
      body={article.body}
      tags={article.tags}
    />
  ));

  return <div className="flex-grow px-8 md:px-0">{articleItem}</div>;
}

export default ArticleList;
