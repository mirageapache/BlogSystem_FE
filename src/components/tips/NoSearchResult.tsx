import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Link } from 'react-router-dom';
import { setShowCreateModal } from 'redux/postSlice';

interface propsType {
  msgOne: string | undefined;
  msgTwo: string | undefined;
  type: string | undefined;
}

function NoSearchResult({ msgOne, msgTwo, type }: propsType) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col justify-center items-center max-h-80 mt-10">
      <FontAwesomeIcon
        icon={icon({ name: 'search', style: 'solid' })}
        className="h-8 w-8 m-5 stroke-0 text-gray-500 dark:text-gray-100"
      />
      <p className="text-2xl sm:text-3xl m-1">{!isEmpty(msgOne) ? msgOne : '搜尋不到相關資料！'}</p>
      <p className="text-2xl sm:text-3xl m-1">{!isEmpty(msgTwo) ? msgTwo : '請重新查詢'}</p>

      {type === 'createArticle' && (
        <Link
          to="/article/create"
          className="mt-5 bg-orange-500 rounded-md cursor-pointer py-2 px-4 hover:bg-orange-600"
        >
          撰寫文章
        </Link>
      )}

      {type === 'createPost' && (
        <button
          type="button"
          className="mt-5 bg-orange-500 rounded-md cursor-pointer py-2 px-4 hover:bg-orange-600"
          onClick={() => dispatch(setShowCreateModal(true))}
        >
          發佈貼文
        </button>
      )}
    </div>
  );
}

export default NoSearchResult;
