/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { UserDataType } from 'types/userType';
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { get } from 'lodash';
import { guardVisitorAction } from 'utils/common';
import { changeFollowState, followUser, unfollowUser } from 'api/follow';

interface PropType {
  user: UserDataType;
  refetch: () => void;
}

function FollowBtn({ user, refetch }: PropType) {
  // state為追蹤狀態 [0-追蹤(不主動推播) / 1-主動推播]
  const [activeDropdown, setActiveDropdown] = useState('');

  /** 控制下拉選單 */
  const toggleDropdown = (id: string) => {
    setActiveDropdown((prevActiveDropdown) => (prevActiveDropdown === id ? '' : id));
  };

  /** 追蹤 mutation */
  const followMutation = useMutation(({ targetId }: { targetId: string }) => followUser(targetId), {
    onSuccess: (res) => {
      if (res.status === 200) refetch();
      else if (handleStatus(get(res, 'status', 0)) === 4) handleApiError(res);
    },
    onError: () => errorAlert(),
  });

  /** 取消追蹤 mutation */
  const unfollowMutation = useMutation(
    ({ targetId }: { targetId: string }) => unfollowUser(targetId),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          toggleDropdown('');
          refetch();
        } else if (handleStatus(get(res, 'status', 0)) === 4) {
          handleApiError(res);
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 更改訂閱狀態 */
  const changeState = useMutation(
    ({ targetId, state }: { targetId: string; state: number }) =>
      changeFollowState(targetId, state),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          toggleDropdown('');
          refetch();
        } else if (handleStatus(get(res, 'status', 0)) === 4) {
          handleApiError(res);
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 追蹤(含訪客守衛) */
  const handleFollow = () => {
    if (guardVisitorAction()) return;
    followMutation.mutate({ targetId: user._id });
  };

  /** 取消追蹤(含訪客守衛) */
  const handleUnfollow = () => {
    if (guardVisitorAction()) return;
    unfollowMutation.mutate({ targetId: user._id });
  };

  /** 切換通知狀態(含訪客守衛) */
  const handleChangeState = (state: number) => {
    if (guardVisitorAction()) return;
    changeState.mutate({ targetId: user._id, state });
  };

  return (
    <div className="relative flex items-center">
      {user.isFollow ? (
        <button
          type="button"
          className="py-1 px-3 rounded-lg text-white bg-gray-500"
          onClick={() => toggleDropdown(user._id)}
        >
          追蹤中
          <FontAwesomeIcon icon={faCaretDown} className="ml-1" />
        </button>
      ) : (
        <button
          type="button"
          className="py-1 px-3 rounded-lg text-white bg-green-600"
          onClick={handleFollow}
        >
          追蹤
        </button>
      )}
      {/* 追蹤中下拉選單 */}
      {activeDropdown === user._id && (
        <>
          <div className="absolute w-28 border rounded-lg py-2 px-1 top-12 right-0 bg-white dark:bg-gray-950 dark:border-gray-600 z-50">
            {user.followState === 1 ? (
              <button
                type="button"
                className="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleChangeState(0)}
              >
                關閉通知
              </button>
            ) : (
              <button
                type="button"
                className="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleChangeState(1)}
              >
                開啟通知
              </button>
            )}
            <button
              type="button"
              className="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={handleUnfollow}
            >
              取消追蹤
            </button>
          </div>
          <div
            className="fixed z-40 top-0 left-0 w-full h-full"
            onClick={() => {
              toggleDropdown('');
            }}
          />
        </>
      )}
    </div>
  );
}

export default FollowBtn;
