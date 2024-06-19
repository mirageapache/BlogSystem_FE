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
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
      <div className="fixed w-full h-full rounded-lg sm:max-w-[600px] sm:h-auto sm:max-h-[600px] bg-white dark:bg-gray-950 z-40">
        {/* modal header */}
        <div className="flex justify-between items-center w-full  py-2 px-5">
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

        {/* modal body */}
        <div className="p-5 min-h-56 border-y-[1px] border-gray-300 dark:border-gray-700">
          <textarea
            name="content"
            className="w-full h-auto resize-none outline-none border border-red-500"
            placeholder="告訴大家你的想法..."
            minLength={10}
          />
        </div>

        {/* modal footer */}
        <div className="fixed bottom-0 sm:relative sm:bottom-auto py-3 px-5 text-right">
          <button type="button" className="w-24 py-1.5 mr-6 text-white rounded-md bg-gray-500">
            取消
          </button>
          <button type="button" className="w-24 py-1.5 text-white rounded-md bg-green-600">
            發佈貼文
          </button>
        </div>
      </div>
      <div className="fixed w-full h-full bg-black opacity-40" onClick={handleClose} />
    </div>
  );
}

export default PostCreateModal;
