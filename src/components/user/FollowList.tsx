/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { get, isEmpty } from 'lodash';
import { useMutation } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

// --- types ---
import { FollowResultType } from 'types/followType';
import { UserDataType } from 'types/userType';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserInfoPanel from './UserInfoPanel';
// --- functions ---
import { changeFollowState, followUser, unfollowUser } from '../../api/follow';
import { getCookies } from '../../utils/common';
import { errorAlert } from '../../utils/fetchError';
import UserListLoading from './UserListLoading';

interface PropsType {
  type: string;
  followList: FollowResultType;
}

function FollowList({ type, followList }: PropsType) {
  let listData; // 清單資料
  const { isLoading, data, refetch } = followList;
  const userList: UserDataType[] = get(data, 'data', []);
  const followingData: UserDataType[] = get(data, 'data', []);
  const followerData: UserDataType[] = get(data, 'data', []);

  if (isLoading) return <UserListLoading />;
  if (type === 'userList' && isEmpty(userList))
    return <NoSearchResult msgOne="搜尋不到相關用戶資料" msgTwo="" type="user" />;
  if (type === 'following' && isEmpty(followingData))
    return (
      <NoSearchResult msgOne="你還沒有追蹤其他人喔!" msgTwo="快去尋找有趣的人吧" type="user" />
    );
  if (type === 'follower' && isEmpty(followerData))
    return <NoSearchResult msgOne="你還沒有粉絲喔!" msgTwo="快去拓展你的粉絲圈吧" type="user" />;

  const [activeDropdown, setActiveDropdown] = useState('');
  const currentUser = getCookies('uid'); // 目前登入的User Id

  /** 控制下拉選單 */
  const toggleDropdown = (id: string) => {
    setActiveDropdown((prevActiveDropdown) => (prevActiveDropdown === id ? '' : id));
  };

  /** 追蹤 mutation */
  const followMutation = useMutation(
    ({ targetId }: { targetId: string }) => followUser(currentUser!, targetId),
    {
      onSuccess: (res) => {
        if (res.status === 200) refetch();
      },
      onError: () => errorAlert(),
    }
  );

  /** 取消追蹤 mutation */
  const unfollowMutation = useMutation(
    ({ targetId }: { targetId: string }) => unfollowUser(currentUser!, targetId),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          toggleDropdown('');
          refetch();
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 更改訂閱狀態 */
  const changeState = useMutation(
    ({ targetId, state }: { targetId: string; state: number }) =>
      changeFollowState(currentUser!, targetId, state),
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          toggleDropdown('');
          refetch();
        }
      },
      onError: () => errorAlert(),
    }
  );

  /** 建立追蹤清單元素 */
  const generateList = (dataList: UserDataType[]) => {
    return dataList.map((user) => {
      if (user._id === currentUser) return null;
      return (
        <div
          className="flex justify-between px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          key={user._id}
        >
          <UserInfoPanel
            userId={user._id}
            account={user.account}
            name={user.name}
            avatarUrl={user.avatar}
            bgColor={user.bgColor}
            className="my-2"
          />
          {!isEmpty(currentUser) && (
            <div className="relative flex items-center">
              {user.isFollow ? (
                <button
                  type="button"
                  className="py-1 px-3 rounded-lg text-white bg-gray-500"
                  onClick={() => toggleDropdown(user._id)}
                >
                  追蹤中
                  <FontAwesomeIcon
                    icon={icon({ name: 'caret-down', style: 'solid' })}
                    className="ml-1"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="py-1 px-3 rounded-lg text-white bg-green-600"
                  onClick={() => followMutation.mutate({ targetId: user._id })}
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
                        onClick={() => {
                          changeState.mutate({ targetId: user._id, state: 0 });
                        }}
                      >
                        關閉通知
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => {
                          changeState.mutate({ targetId: user._id, state: 1 });
                        }}
                      >
                        開啟通知
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        unfollowMutation.mutate({ targetId: user._id });
                      }}
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
          )}
        </div>
      );
    });
  };

  // 使用者清單
  if (type === 'userList') listData = generateList(userList);
  // 追蹤
  if (type === 'following') listData = generateList(followingData);
  // 粉絲
  if (type === 'follower') {
    listData = followerData.map((item) => {
      return (
        <div className="flex justify-between" key={item._id}>
          <UserInfoPanel
            userId={item._id}
            account={item.account}
            name={item.name}
            avatarUrl={item.avatar}
            bgColor={item.bgColor}
            className="my-2"
          />
        </div>
      );
    });
  }

  return <div className="w-full">{listData}</div>;
}

export default FollowList;
