import { get, isEmpty } from 'lodash';
// --- components ---
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
import ArticleItem from './ArticleItem';
import Loading from './ArticleLoading';
// --- api / type ---
// import { ArticleResultType } from '../../api/article';
import { ArticleDataType, ArticleResultType } from '../../types/articleType';

function ArticleList(props: { articleQueryData: ArticleResultType }) {
  const { articleQueryData } = props;
  const { isLoading, error, data } = articleQueryData;
  const articleList: [ArticleDataType] = get(data, 'posts', null)!;
  const errorMsg = get(articleQueryData, 'data.mssage', '');

  if (isLoading) return <Loading />;
  if (!isEmpty(error) || !isEmpty(errorMsg)) {
    return <BasicErrorPanel errorMsg={errorMsg} />;
  }
  if (isEmpty(articleList)) return <NoSearchResult msgOne="搜尋不到相關資訊" msgTwo="" type="" />;

  const articleItem = articleList.map((article) => (
    <ArticleItem articleData={article} />
  ));
  return <div className="flex-grow">{articleItem}</div>;
}

export default ArticleList;
