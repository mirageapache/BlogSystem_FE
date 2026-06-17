import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Spinner() {
  return (
    <div className="flex justify-center items-center text-2xl md:text-3xl w-full mt-20">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin h-7 w-7 m-1.5 mr-3" />
      載入中
    </div>
  );
}

export default Spinner;
