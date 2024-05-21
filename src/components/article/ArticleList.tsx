import { get, isEmpty } from 'lodash';
// --- components ---
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
import ArticleItem from './ArticleItem';
import Loading from './ArticleLoading';
// --- api / type ---
import { ArticleResultType } from '../../api/article';
import { ArticleListType } from '../../types/articleType';

function ArticleList(props: { articleQueryData: ArticleResultType }) {
  const { articleQueryData } = props;
  const { isLoading, error, data } = articleQueryData;
  const articleList: [ArticleListType] = get(data, 'posts', null)!;
  const errorMsg = get(articleQueryData, 'data.mssage', '');

  if (isLoading) return <Loading />;
  if (!isEmpty(error) || !isEmpty(errorMsg)) {
    return <BasicErrorPanel errorMsg={errorMsg} />;
  }
  if (isEmpty(articleList)) return <NoSearchResult msgOne="搜尋不到相關資訊" msgTwo="" type="" />;

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
