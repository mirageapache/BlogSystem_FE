import { useState } from 'react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { get, isEmpty } from 'lodash';
import { Link, useParams } from 'react-router-dom';
// --- components ---
import Avatar from 'components/user/Avatar';
import ArticleList from 'components/article/ArticleList';
import Spinner from 'components/tips/Spinner';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';
import NoSearchResult from 'components/tips/NoSearchResult';
// --- api / type ---
import { ApiResultType, getPartialArticles } from '../../api/article';
import { getOwnProfile, getUserProfile } from '../../api/user';

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('article');
  const [activeStyle, setActiveStyle] = useState('');
  const { uid } = useParams();
  const [cookies] = useCookies(['uid']);
  let getUserDataFetch;
  let identify = false; // 身分驗證 true => own / false => others
  // ***進行身分驗證，確認是登入的當前使用者才顯示"編輯"等功能
  if(cookies.uid === uid){
    getUserDataFetch = useQuery('user', () => getOwnProfile(uid!));
    identify = true;
  } else {
    getUserDataFetch = useQuery('user', () => getUserProfile(uid!));
  }
  const { isLoading, isSuccess, data } = getUserDataFetch;
  const fetchStatus = get(data, 'status', '404');
  const apiResult = useQuery('aritcles', () => getPartialArticles(10)) as ApiResultType;

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
      default:
        setActiveStyle('translate-x-0');
    }
  };

  if(isLoading) return <Spinner />

  if(isSuccess){
    if(fetchStatus === 200){
      const userData = get(getUserDataFetch, 'data.data');
      return (
        <div className="w-full sm:max-w-[600px] p-5">
          <div className="flex justify-between mb-3">
            <div className="flex gap-4">
              <div>
                <Avatar
                  name="test"
                  avatarUrl={userData.avatar}
                  size="w-[72px] h-[72px]"
                  textSize="text-4xl"
                />
              </div>
              <div className="">
                <p className="text-3xl font-semibold">{userData.name}</p>
                <p className="text-gray-500">@{userData.account}</p>
              </div>
            </div>
            {/* 編輯功能 */}
            {identify &&
              <div>
                <Link
                  to={"/editProfile"}
                  type="button"
                  className="flex items-center rounded-lg text-white bg-sky-500 hover:bg-sky-700 p-2 md:px-4 md:py-1 dark:bg-sky-800"
                >
                  <p className="hidden md:inline-block">編輯</p>
                </Link>
              </div>
            }
          </div>
          {!isEmpty(userData.bio) && 
            <div className="bg-gray-100 rounded-md p-2">
              <p>{userData.bio}</p>
            </div>
          }
          


          <div>
            {/* 頁籤 */}
            <div>
              <div className="mt-4 text-lg flex border-b-[1px] border-gray-400 dark:text-gray-400">
                <button
                  type="button"
                  className="flex w-1/3 justify-center py-1.5 hover:cursor-pointer outline-none"
                  onClick={() => handleTabActive('article')}
                >
                  文章
                </button>
                <button
                  type="button"
                  className="flex w-1/3 justify-center py-1.5 hover:cursor-pointer outline-none"
                  onClick={() => handleTabActive('post')}
                >
                  貼文
                </button>
                <button
                  type="button"
                  className="flex w-1/3 justify-center py-1.5 hover:cursor-pointer outline-none"
                  onClick={() => handleTabActive('follow')}
                >
                  追蹤
                </button>
              </div>
              <div className="flex justify-start -translate-y-0.5">
                <div
                  className={`border-b-[3px] border-orange-500 w-1/3 text-transparent ${activeStyle} transform duration-300 ease-in-out`}
                />
              </div>
            </div>
            {activeTab === 'article' && (
              <div className="">
                <ArticleList apiResult={apiResult} />
              </div>
            )}
            {activeTab === 'post' && <div className="">尚無貼文資料</div>}
            {activeTab === 'follow' && <div className="">尚未追蹤其他人</div>}
          </div>
        </div>
      );
    }
    
    return (
      <NoSearchResult message='你查詢的使用者不存在' type="user" />
    )
  }

  return (
    <BasicErrorPanel errorMsg='' />
  )
  
}

export default UserProfilePage;
