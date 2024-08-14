/* eslint-disable no-restricted-globals */
import React from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { setEditMode, SysStateType } from 'redux/sysSlice';
import { checkCancelEdit } from 'utils/common';

interface StateType {
  system: SysStateType;
}

function BackwardBtn() {
  const editMode = useSelector((state: StateType) => state.system.editMode); // 編輯模式
  const dispatch = useDispatch();

  return (
    <div>
      <button
        aria-label="back"
        type="button"
        className="flex items-center text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
        onClick={async() => {
          if (editMode) {
            const isClose = await checkCancelEdit();
            if (isClose) {
              // 編輯模式再次確認是否取消編輯
              if(window.location.pathname.includes('/article/create')) history.back();
              dispatch(setEditMode(false));
            }
          } else {
            history.back()
          }
        }}
      >
        <FontAwesomeIcon icon={icon({ name: 'circle-left', style: 'solid' })} className="w-7 h-7" />
      </button>
    </div>
  );
}

export default BackwardBtn;
