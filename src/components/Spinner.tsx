import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

function Spinner() {
  return (
    <div className="flex justify-center items-center text-2xl md:text-3xl w-full mt-20">
      <FontAwesomeIcon
        icon={icon({ name: 'spinner', style: 'solid' })}
        className="animate-spin h-7 w-7 m-1.5 mr-3"
      />
      載入中
    </div>
  );
}

export default Spinner;
