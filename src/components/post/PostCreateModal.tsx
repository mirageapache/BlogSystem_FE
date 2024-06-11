import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface PropsType {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function PostCreateModal({ setShowModal }: PropsType) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-40 bg-gray-800 opacity-5">
      <div className="min-h-[300px] w-full md:max-w-[600px] bg-white dark:bg-gray-950 opacity-0">
        <div className="w-full">
          <span>建立貼文</span>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="h-7 w-7 m-1 text-gray-900 dark:text-gray-100"
            />
          </button>
        </div>
        <div>body</div>
        <div>footer</div>
      </div>
    </div>
  );
}

export default PostCreateModal;
