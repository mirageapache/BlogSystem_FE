/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setShowCreateModal } from '../../redux/postSlice';
import { getCookies } from 'utils/common';
import { useMutation } from 'react-query';
import { createPost } from 'api/post';
import { PostVariablesType } from 'types/postType';
import { errorAlert } from 'utils/fetchError';

function PostCreateModal() {
  const dispatchSlice = useDispatch();
  const [content, setContent] = useState('');

  /** 關閉modal */
  const handleClose = () => {
    dispatchSlice(setShowCreateModal(false));
  };

  /** 新增貼文 mutation */
  const createPostMutation = useMutation(
    (variables: PostVariablesType) => createPost(variables),
    {
      onSuccess: (res) => {
        if (res.status === 200) console.log(res);
      },
      onError: () => errorAlert(),
    }
  );

  /** 發佈貼文 */
  const handleSubmit = () => {
    const userId = getCookies('uid') as string;
    const variables: PostVariablesType = {
      author: userId,
      content,
      status: 1,
    }

    console.log(variables);
    createPostMutation.mutate(variables);
  }

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
        <div className="p-5 h-80 border-y-[1px] border-gray-300 dark:border-gray-700">
          <textarea
            name="content"
            className="w-full h-80 resize-none outline-none border border-red-500"
            placeholder="告訴大家你的想法..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* modal footer */}
        <div className="fixed bottom-0 sm:relative sm:bottom-auto py-3 px-5 text-right">
          <button type="button" className="w-24 py-1.5 mr-6 text-white rounded-md bg-gray-500" onClick={handleClose}>
            取消
          </button>
          <button type="button" className="w-24 py-1.5 text-white rounded-md bg-green-600" onClick={handleSubmit}>
            發佈貼文
          </button>
        </div>
      </div>
      <div className="fixed w-full h-full bg-black opacity-40" onClick={handleClose} />
    </div>
  );
}

export default PostCreateModal;
