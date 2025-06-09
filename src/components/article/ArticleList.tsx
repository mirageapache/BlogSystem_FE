import { get, isEmpty } from 'lodash';
// --- components ---
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// import ArticleItem from './ArticleItem';
import TiptapArticleItem from './TiptapArticleItem';
import ArticleListLoading from './ArticleListLoading';
// --- api / type ---
import { ArticleDataType, ArticleResultType } from '../../types/articleType';

function ArticleList(props: { articleListData: ArticleResultType }) {
  const { articleListData } = props;
  const { isLoading, error, data } = articleListData;

  const articleList: ArticleDataType[] | null = data as ArticleDataType[] | null;
  const apiStatus = get(articleList, 'status');
  const errorMsg = get(articleList, 'data.message', '');

  if (isLoading) return <ArticleListLoading />;
  if (!isEmpty(error)) {
    return <BasicErrorPanel errorMsg="" />;
  }
  if ((!isEmpty(apiStatus) && apiStatus !== 200) || !isEmpty(errorMsg)) {
    return <NoSearchResult msgOne="搜尋不到相關文章" msgTwo="" type="" />;
  }
  if (isEmpty(articleList)) return <NoSearchResult msgOne="搜尋不到相關資訊" msgTwo="" type="" />;

  const articleItem = articleList!.map((article) => (
    <TiptapArticleItem key={article._id} articleData={article} />
  ));
  return <div className="flex-grow px-3 md:px-0">{articleItem}</div>;
}

export default ArticleList;
