import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// --- components ---
import Avatar from 'components/user/Avatar';
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
import ProfilePost from 'components/profile/ProfilePost';
import ProfileArticle from 'components/profile/ProfileArticle';
import ProfileFollowing from 'components/profile/ProfileFollowing';
import ProfileFollowed from 'components/profile/ProfileFollowed';
// --- api / type ---
import { UserProfileType, UserResultType } from 'types/userType';
import FollowBtn from 'components/user/FollowBtn';
import { getOwnProfile, getUserProfile } from '../../api/user';
import { UserStateType } from '../../redux/userSlice';
import { setSignInPop } from '../../redux/loginSlice';
import { setActivePage } from '../../redux/sysSlice';
import { checkLogin } from '../../utils/common';

interface StateType {
  user: UserStateType;
}

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('article'); // 頁籤控制
  const [activeStyle, setActiveStyle] = useState(''); // 頁籤樣式控制
  const { userId } = useParams(); // 網址列的userId
  const currentUserId = useSelector((state: StateType) => state.user.userData?.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStateData = useSelector((state: StateType) => state.user.userData);
  const identify = currentUserId === userId; // 身分驗證 true => own / false => others

  /** 取得使用者資料：hook 必須無條件呼叫，own/others 共用單一 useQuery，用 queryKey/queryFn 分流。
   * own 已有 redux 資料時不重打；others 一律抓；userId 缺失時停用。 */
  const fetchProfile = useQuery({
    queryKey: identify ? ['getOwnProfile', userId] : ['getUserProfile', userId],
    queryFn: () => (identify ? getOwnProfile() : getUserProfile(userId!)),
    enabled:
      userId !== undefined && (!identify || isEmpty(userStateData) || userStateData!._id === ''),
    // useQuery 的 data 型別與 UserResultType.data 不完全重疊（TS 5.x 起 as 直轉被擋），
    // 此處刻意收斂為自訂 Result 型別，循 TS 建議經 unknown 轉型。
  }) as unknown as UserResultType;

  const { isLoading, error, data, refetch } = fetchProfile;
  const fetchStatus = get(data, 'status', 404);

  // userData 純運算推導（副作用集中於下方 effect，不在 render 期 dispatch）
  let userData: UserProfileType | undefined;
  if (identify && !isEmpty(userStateData)) {
    userData = userStateData as UserProfileType;
  } else if (fetchStatus !== 401) {
    userData = get(data, 'data', {}) as UserProfileType;
  }

  // userId 缺失 → 導回首頁
  useEffect(() => {
    if (userId === undefined) navigate('/');
  }, [userId]);

  // 瀏覽他人頁面 → 頁籤切到 explore
  useEffect(() => {
    if (!identify) dispatch(setActivePage('explore'));
  }, [identify]);

  // 後端回傳未登入 → 彈出登入框
  useEffect(() => {
    if (fetchStatus === 401) dispatch(setSignInPop(true));
  }, [fetchStatus]);

  /** 頁籤切換 */
  const handleTabActive = (tabValue: string) => {
    setActiveTab(tabValue);
    switch (tabValue) {
      case 'article':
        setActiveStyle('translate-x-0');
        break;
      case 'post':
        setActiveStyle('translate-x-full');
        break;
      case 'follow':
        setActiveStyle('translate-x-[200%]');
        break;
      case 'follower':
        setActiveStyle('translate-x-[300%]');
        break;
      default:
        setActiveStyle('translate-x-0');
    }
  };

  if (isLoading) return <Spinner />;
  if (error || isEmpty(userData)) return <BasicErrorPanel errorMsg="" />;
  if (isEmpty(userData) && fetchStatus === 404)
    return <NoSearchResult msgOne="使用者不存在" msgTwo="" type="user" />;

  return (
    <div className="w-full sm:max-w-[600px] p-5">
      <div className="flex justify-between mb-3">
        <div className="flex gap-4">
          <div>
            <Avatar
              name={userData.name}
              avatarUrl={userData.avatar}
              size="w-[72px] h-[72px]"
              textSize="text-4xl"
              bgColor={userData.bgColor}
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-3xl font-semibold">{userData.name}</p>
            <p className="text-gray-500">@{userData.account}</p>
          </div>
        </div>
        {/* 追蹤狀態 */}
        {!identify && checkLogin() && <FollowBtn user={userData} refetch={refetch} />}
        {/* 編輯功能 */}
        {identify && (
          <div className="flex justify-center items-center">
            <Link
              to="/user/editProfile"
              type="button"
              className="flex items-center rounded-lg text-white bg-sky-500 hover:bg-sky-700 p-2 md:px-4 md:py-1 dark:bg-sky-800"
            >
              <p>編輯</p>
            </Link>
          </div>
        )}
      </div>
      {!isEmpty(userData.bio) && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-2">
          <p>{userData.bio}</p>
        </div>
      )}

      <div>
        {/* 頁籤 */}
        <div>
          <div className="mt-4 text-lg flex border-b-[1px] border-gray-400 dark:text-gray-400">
            <button
              type="button"
              className="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('article')}
            >
              文章
            </button>
            <button
              type="button"
              className="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('post')}
            >
              貼文
            </button>
            <button
              type="button"
              className="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('follow')}
            >
              追蹤
            </button>
            <button
              type="button"
              className="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              onClick={() => handleTabActive('follower')}
            >
              粉絲
            </button>
          </div>
          <div className="flex justify-start -translate-y-0.5">
            <div
              className={`border-b-[3px] border-orange-500 w-1/4 text-transparent ${activeStyle} transform duration-300 ease-in-out`}
            />
          </div>
        </div>

        {/* 文章 Article */}
        {activeTab === 'article' && (
          <div className="">
            <ProfileArticle userId={userId!} identify={identify} />
          </div>
        )}

        {/* 貼文 Post */}
        {activeTab === 'post' && (
          <div className="">
            <ProfilePost userId={userId!} identify={identify} />
          </div>
        )}

        {/* 追蹤 follow */}
        {activeTab === 'follow' && (
          <div className="">
            <ProfileFollowing userId={userId!} identify={identify} />
          </div>
        )}

        {/* 粉絲 follower */}
        {activeTab === 'follower' && (
          <div className="">
            <ProfileFollowed userId={userId!} identify={identify} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
