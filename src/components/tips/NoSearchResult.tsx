import { isEmpty } from 'lodash';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface propsType {
  message: string | undefined;
  type: string | undefined;
}

function NoSearchResult({ message, type }: propsType) {
  return (
    <div className="flex justify-center items-center max-h-80 mt-10">
      <FontAwesomeIcon
        icon={icon({ name: 'search', style: 'solid' })}
        className="h-8 w-8 m-1.5 stroke-0 text-gray-500 dark:text-gray-100"
      />
      <p className="text-3xl">{!isEmpty(message) ? message : '搜尋不到相關資料，請重新查詢'}</p>
    </div>
  );
}

export default NoSearchResult;
