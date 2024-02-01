import { useQuery } from 'react-query';
import { get } from 'lodash';
import ArticleItem from './ArticleItem';
import { getPostByLimit } from '../../api/post';

/**articleList 型別 */
interface ArticleType {
  body: string;
  id: number;
  reactions: number;
  tags: string[];
  title: string;
  userId: number;
}

function ArticleList() {
  const { isLoading, error, data } = useQuery('posts', () => getPostByLimit(5));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  const articleList: ArticleType[] = get(data, 'posts', []);
  const articleItem = articleList.map((article) => (
    <ArticleItem key={article.id} id={article.id} title={article.title} body={article.body} tags={article.tags} />
  ));

  return <div className="flex-grow px-8 md:px-0">{articleItem}</div>;
}

export default ArticleList;
