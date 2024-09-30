import { useState } from 'react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { get, isEmpty } from 'lodash';
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
import { getOwnProfile, getUserProfile } from '../../api/user';
import { UserStateType } from '../../redux/userSlice';
import { setSignInPop } from '../../redux/loginSlice';
import { setActivePage } from '../../redux/sysSlice';

interface StateType {
  user: UserStateType;
}

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('article'); // 頁籤控制
  const [activeStyle, setActiveStyle] = useState(''); // 頁籤樣式控制
  const authToken = localStorage.getItem('authToken');
  const { userId } = useParams(); // 網址列的userId
  const [cookies] = useCookies(['uid']); // 存在cookie的userId
  let identify = false; // 身分驗證 true => own / false => others
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userStateData = useSelector((state: StateType) => state.user.userData);
  let fetchProfile: UserResultType; // 取得profile的回傳useQuery資料
  let userData: UserProfileType | undefined;

  if (userId === undefined) navigate('/');

  /** 取得使用者資料 */
  if (cookies.uid === userId && !isEmpty(authToken)) {
    // own [current user]
    identify = true;
    fetchProfile = useQuery(['getOwnProfile', userId], () => getOwnProfile(userId!, authToken!), {
      enabled: isEmpty(userStateData) || userStateData!._id === '',
    }) as UserResultType;
  } else {
    // others [其他user]
    fetchProfile = useQuery(['getUserProfile', userId], () =>
      getUserProfile(userId!)
    ) as UserResultType;
    dispatch(setActivePage('explore')); // 不是currentUser 頁籤改為 explore
  }

  const { isLoading, error, data } = fetchProfile as UserResultType;
  const fetchStatus = get(data, 'status', 404);
  if (identify && !isEmpty(userStateData)) {
    userData = userStateData as UserProfileType;
  } else if (fetchStatus === 401) {
    // 未登入
    dispatch(setSignInPop(true));
  } else {
    userData = get(data, 'data', {}) as UserProfileType;
  }

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
        {/* 編輯功能 */}
        {identify && (
          <div>
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
            <ProfileArticle userId={userId!} />
          </div>
        )}

        {/* 貼文 Post */}
        {activeTab === 'post' && (
          <div className="">
            <ProfilePost userId={userId!} />
          </div>
        )}

        {/* 追蹤 follow */}
        {activeTab === 'follow' && (
          <div className="">
            <ProfileFollowing userId={userId!} />
          </div>
        )}

        {/* 粉絲 follower */}
        {activeTab === 'follower' && (
          <div className="">
            <ProfileFollowed userId={userId!} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
