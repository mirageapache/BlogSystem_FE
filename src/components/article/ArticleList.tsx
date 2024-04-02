import { get, isEmpty } from 'lodash';
// --- components ---
import ArticleItem from './ArticleItem';
import Loading from './Loading';
// --- api / type ---
import { ApiResultType, ArticleListType } from '../../api/article';

function ArticleList(props: { apiResult: ApiResultType }) {
  const { apiResult } = props;
  const { isLoading, error, data } = apiResult;
  const articleList: [ArticleListType] = get(data, 'posts', null)!;
  const errorMsg = get(apiResult, 'data.mssage', '');

  if (isLoading) return <Loading />;
  if (!isEmpty(error) || !isEmpty(errorMsg)) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-3xl">{!isEmpty(errorMsg) ? errorMsg : '發生一些錯誤，請稍後再試!!'}</p>
      </div>
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
