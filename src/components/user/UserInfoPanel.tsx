/* eslint-disable react/require-default-props */
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
}) {
  const { userId, account, name, avatarUrl, bgColor, className } = props;
  const dispatch = useDispatch();
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
        <Link
          to={`/user/profile/${userId}`}
          onClick={() => {
            dispatch(setActivePage('user'));
            scrollToTop();
          }}
        >
          <p className="text-[14px] text-gray-700 dark:text-gray-400 hover:text-orange-500 leading-4">
            @{account}
          </p>
        </Link>
      </div>
    </div>
  );
}

export default UserInfoPanel;
