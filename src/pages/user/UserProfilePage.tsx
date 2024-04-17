import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useCookies } from 'react-cookie';
import { isEmpty } from 'lodash';
// --- components ---
import Avatar from 'components/user/Avatar';
import ArticleList from 'components/article/ArticleList';
// --- api / type ---
import { ApiResultType, getPartialArticles } from '../../api/article';
import { UserDataType, getUserProfile } from '../../api/user';

function UserProfilePage() {
  const apiResult = useQuery('aritcles', () => getPartialArticles(10)) as ApiResultType;
  const [activeTab, setActiveTab] = useState('article');
  const [activeStyle, setActiveStyle] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['uid']);
  const [userData, setUserData] = useState<UserDataType>();

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserProfile(cookies.uid);
      setUserData(res.data);
    };
    fetchData();
  }, []);

  if (isEmpty(userData)) {
    return (
      <div>
        <p>使用者不存在</p>
      </div>
    );
  }

  return (
    <div className="w-full sm:max-w-[600px] p-5">
      <div className="flex gap-4 mb-3">
        <div>
          <Avatar avatarUrl={userData.avatar} size="w-[72px] h-[72px]" textSize="text-4xl" />
        </div>
        <div className="">
          <p className="text-3xl font-semibold">{userData.name}</p>
          <p className="text-gray-500">@{userData.account}</p>
        </div>
      </div>
      <div>
        <p>
          Helping software engineers level up and standout in their career.talks about how to level
          up in your software engineering career.
        </p>
      </div>
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

export default UserProfilePage;
