import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setShowCreateModal } from '../../redux/postSlice';

function PostCreateModal() {
  const dispatchSlice = useDispatch();

  return (
    <div className='fixed top-0 left-0 z-40'>
      <div className="fixed w-full h-full flex justify-center items-center z-50">
        <div className="fixed min-h-[300px] w-full md:max-w-[600px] bg-white dark:bg-gray-950">
          <div className="w-full">
            <span>建立貼文</span>
            <button
              aria-label="close"
              type="button"
              className="flex jsutify-center m-1"
              onClick={() => dispatchSlice(setShowCreateModal(false))}
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
      <div 
        className="fixed w-full h-full z-40 bg-gray-800 opacity-60" 
        onClick={() => dispatchSlice(setShowCreateModal(false))}
      />
    </div>
  );
}

export default PostCreateModal;
