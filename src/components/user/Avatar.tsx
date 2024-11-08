import React from 'react';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
// --- functions ---
import { bgColorConvert } from '../../utils/common';

function Avatar(props: {
  name: string;
  avatarUrl: string;
  size: string;
  textSize: string;
  bgColor: string;
}) {
  const { name, avatarUrl, size, textSize, bgColor } = props;
  const colorStyle = bgColorConvert(bgColor);

  if (isEmpty(avatarUrl)) {
    if (name) {
      const avatarName = name.substring(0, 1).toUpperCase();
      return (
        <span
          className={`${size} ${colorStyle} rounded-full flex justify-center items-center font-semibold cursor-default`}
        >
          <p className={`${textSize} text-center text-white`}>{avatarName}</p>
        </span>
      );
    }
    return (
      <span className={`${size} rounded-full flex justify-center items-center border`}>
        <FontAwesomeIcon
          icon={icon({ name: 'user', style: 'solid' })}
          className="w-8 h-8 text-gray-500"
        />
      </span>
    );
  }
  return <img className={`${size} rounded-full`} src={avatarUrl} alt="avatar" />;
}

export default Avatar;
