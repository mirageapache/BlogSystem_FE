import React, { useState } from 'react';
import { get, isEmpty } from 'lodash';
import { useMutation } from 'react-query';
import Dropdown from 'react-bootstrap/Dropdown';

// --- types ---
import { FollowResultType } from 'types/followType';
import { UserDataType } from 'types/userType';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import UserLoading from './UserLoading';
import UserInfoPanel from './UserInfoPanel';
// --- functions ---
import { handleFollowAction } from '../../api/follow';
import { getCookies } from '../../utils/common';
import { errorAlert } from '../../utils/fetchError';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PropsType {
  type: string;
  followList: FollowResultType;
}

interface followerItemType {
  user: UserDataType;
  state: number;
}

function FollowList({ type, followList }: PropsType) {
  let listData; // 清單資料
  const { isLoading, data, refetch } = followList;
  const userList: UserDataType[] = get(data, 'data', []);
  const followingData: UserDataType[] = get(data, 'data.following', []);
  const followerData: followerItemType[] = get(data, 'data.follower', []);

  if (isLoading) return <UserLoading />;
  if (type === 'following' && isEmpty(followingData))
    return (
      <NoSearchResult msgOne="你還沒有追蹤其他人喔!" msgTwo="快去尋找有趣的人吧" type="user" />
    );
  if (type === 'follower' && isEmpty(followerData))
    return <NoSearchResult msgOne="你還沒有粉絲喔!" msgTwo="快去拓展你的粉絲圈吧" type="user" />;

  const [showPanel, setShowPanel] = useState(false);
  const userId = getCookies('uid');

  /** 追蹤/取消追蹤 功能 mutation */
  const followMutation = useMutation(
    ({ action, targetId }: { action: string; targetId: string }) =>
      handleFollowAction(action, userId!, targetId),
    {
      onSuccess: (res) => {
        if (res.status === 200) refetch(); // refetch list data
      },
      onError: () => errorAlert(),
    }
  );

  /** 建立追蹤清單元素 */
  const generateList = (dataList: UserDataType[]) => {
    return dataList.map((user) => {
      if (user._id === userId) return null;
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
          <div className="flex items-center">
            {user.isFollow ? (
              <button
                type="button"
                className="py-1 px-3 rounded-lg text-white bg-gray-500"
                onClick={() => setShowPanel(!showPanel)}
              >
                追蹤中
              </button>
            ) : (
              <button
                type="button"
                className="py-1 px-3 rounded-lg text-white bg-green-600"
                onClick={() => followMutation.mutate({ action: 'follow', targetId: user._id })}
              >
                追蹤
              </button>
            )}
            {showPanel && (
              <ul className="p-3 border border-red-500">
                <li>噤聲</li>
                <li>取消追蹤</li>
              </ul>
            )}
          </div>
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
        <div className="flex justify-between" key={item.user._id}>
          <UserInfoPanel
            userId={item.user._id}
            account={item.user.account}
            name={item.user.name}
            avatarUrl={item.user.avatar}
            bgColor={item.user.bgColor}
            className="my-2"
          />
          <div className="flex items-center">
            <button type="button" className="py-1 px-4 rounded-lg bg-green-600" onClick={() => {}}>
              追蹤
            </button>
          </div>
        </div>
      );
    });
  }

  return (
    <div>
      {listData}
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default FollowList;
