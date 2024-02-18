import { get, isEmpty } from 'lodash';
// --- components ---
import ArticleItem from './ArticleItem';
import Loading from './Loading';
// --- api / type ---
import { apiResultType, articleListType } from '../../api/article';

function ArticleList(props: { apiResult: apiResultType }) {
  const { apiResult } = props;
  const { isLoading, error, data } = apiResult;
  const articleList: [articleListType] = get(data, 'posts')!;

  if (isLoading) return <Loading />;
  if (!isEmpty(error) || isEmpty(articleList)) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-3xl">
          {isEmpty(error) ? '搜尋不到相關結果!!' : '發生一些錯誤，請稍後再試!!'}
        </p>
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
  return <div className="flex-grow px-8 md:px-0">{articleItem}</div>;
}

export default ArticleList;
