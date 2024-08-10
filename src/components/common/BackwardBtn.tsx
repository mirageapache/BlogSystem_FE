/* eslint-disable no-restricted-globals */
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function BackwardBtn() {
  return (
    <div>
      <button
        aria-label="back"
        type="button"
        className="flex items-center text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
        onClick={() => history.back()}
      >
        <FontAwesomeIcon icon={icon({ name: 'circle-left', style: 'solid' })} className="w-7 h-7" />
      </button>
    </div>
  );
}

export default BackwardBtn;
