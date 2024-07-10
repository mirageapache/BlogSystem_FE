/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// --- functions ---
import { scrollToTop } from '../../utils/common';
import { setActivePage } from '../../redux/sysSlice';
// --- components ---
import Avatar from './Avatar';

function UserInfoPanel(props: {
  userId: string;
  account: string;
  name: string;
  avatarUrl: string;
  bgColor: string;
  className?: string;
  menuLink?: boolean; // 判斷是否為主選單的連結
}) {
  const { userId, account, name, avatarUrl, bgColor, className, menuLink = false } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex justify-center items-center mr-4">
        <Avatar
          name={name}
          avatarUrl={avatarUrl}
          size="w-11 h-11"
          textSize="text-xl"
          bgColor={bgColor}
        />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg leading-6">{name}</p>
        {menuLink ? (
          <p className="text-[14px] text-gray-700 dark:text-gray-400">@{account}</p>
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation(); // 防止冒泡事件
              dispatch(setActivePage('user'));
              scrollToTop();
              navigate(`/user/profile/${userId}`);
            }}
          >
            <p className="text-[14px] text-gray-700 dark:text-gray-400 hover:text-orange-500 leading-4">
              @{account}
            </p>
          </span>
        )}
      </div>
    </div>
  );
}

export default UserInfoPanel;
