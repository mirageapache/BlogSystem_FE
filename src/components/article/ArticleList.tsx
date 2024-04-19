import { get, isEmpty } from 'lodash';
// --- components ---
import ArticleItem from './ArticleItem';
import Loading from './Loading';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
// --- api / type ---
import { ApiResultType } from '../../api/article';
import { ArticleListType } from '../../types/articleType';

function ArticleList(props: { apiResult: ApiResultType }) {
  const { apiResult } = props;
  const { isLoading, error, data } = apiResult;
  const articleList: [ArticleListType] = get(data, 'posts', null)!;
  const errorMsg = get(apiResult, 'data.mssage', '');

  if (isLoading) return <Loading />;
  if (!isEmpty(error) || !isEmpty(errorMsg)) {
    return (
      <BasicErrorPanel errorMsg={errorMsg} />
    );
  }
  const articleItem = articleList.map((article) => (
    <ArticleItem
      key={article.id}
      id={article.id}
      title={article.title}
      body={article.body}
      tags={article.tags}
    />
  ));
  return <div className="flex-grow">{articleItem}</div>;
}

export default ArticleList;
