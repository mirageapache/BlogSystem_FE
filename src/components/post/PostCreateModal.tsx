/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setShowCreateModal } from '../../redux/postSlice';

function PostCreateModal() {
  const dispatchSlice = useDispatch();

  const handleClose = () => {
    dispatchSlice(setShowCreateModal(false));
  };

  return (
    <div className="fixed top-0 left-0 z-40">
      <div
        className="fixed w-full h-full flex justify-center items-center z-50"
        onClick={handleClose}
      >
        <div className="fixed w-full h-full rounded-lg sm:max-w-[600px] sm:h-auto sm:max-h-[600px] bg-white dark:bg-gray-950">
          <div className="flex justify-between items-center w-full border-b-[1px] border-gray-300 dark:border-gray-700 py-2 px-5">
            <h3 className="text-xl font-bold">建立貼文</h3>
            <button
              aria-label="close"
              type="button"
              className="flex jsutify-center m-1"
              onClick={handleClose}
            >
              <FontAwesomeIcon
                icon={icon({ name: 'xmark', style: 'solid' })}
                className="h-6 w-6 m-1 text-gray-500 hover:text-red-500"
              />
            </button>
          </div>
          <div className="p-5">body</div>
          <div className="p-5">footer</div>
        </div>
      </div>
      <div className="fixed w-full h-full bg-black opacity-40" />
    </div>
  );
}

export default PostCreateModal;
