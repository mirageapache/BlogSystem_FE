import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/dateTime';

/** Article Tags 元件 */
function ArticleTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-3">
      <Link to="/" className="font-bold">
        {text.toUpperCase()}
      </Link>
    </span>
  );
}

/** ArticleItem 參數型別 */
interface ArticleItemPropsType {
  id: number;
  title: string;
  tags: string[];
  body: string;
}

/** ArticleItem 元件 */
function ArticleItem({ id, title, body, tags }: ArticleItemPropsType) {
  const tagsList = tags.map((tag) => <ArticleTag key={`${tag}-${id}`} text={tag} />);

  return (
    <div className="text-left border-b-[1px] p-1 sm:p-2 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-default">
      <div className="">
        <div className="flex w-full">
          <div className="my-2 mr-3">
            {isEmpty(true) ? (
              <span className="w-11 h-11 rounded-full flex justify-center items-center bg-sky-600 font-semibold">
                <p className="text-xl text-center text-white">J</p>
              </span>
            ) : (
              <img className="w-11 h-11 rounded-full" src="" alt="author avatar" />
            )}
          </div>

          <div className="flex justify-between w-full text-md text-gray-600 dark:text-gray-300 my-1">
            <span className="flex items-center">
              <p className="mr-1">James</p>
              <p className="text-sm hover:text-orange-500 cusor-pointer my-1">(james_w)</p>
            </span>
            <p className="">{formatDateTime('20240101')}</p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-2xl xl:text-3xl">
            <Link to={`/article/${id}`} className="hover:underline">
              {title}
            </Link>
          </h2>
          <div className="text-orange-500">{tagsList}</div>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{body}</p>
        </div>
      </div>
    </div>
  );
}

export default ArticleItem;
