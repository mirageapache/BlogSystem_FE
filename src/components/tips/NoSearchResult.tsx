import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface propsType {
  msgOne: string | undefined;
  msgTwo: string | undefined;
  type: string | undefined;
}

function NoSearchResult({ msgOne, msgTwo, type }: propsType) {
  return (
    <div className="flex flex-col justify-center items-center max-h-80 mt-10">
      <FontAwesomeIcon
        icon={icon({ name: 'search', style: 'solid' })}
        className="h-8 w-8 m-5 stroke-0 text-gray-500 dark:text-gray-100"
      />
      <p className="text-2xl sm:text-3xl m-1">{!isEmpty(msgOne) ? msgOne : '搜尋不到相關資料！'}</p>
      <p className="text-2xl sm:text-3xl m-1">{!isEmpty(msgTwo) ? msgTwo : '請重新查詢'}</p>
    </div>
  );
}

export default NoSearchResult;
