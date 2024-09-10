import React from 'react';
import { isEmpty } from 'lodash';
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
    const avatarName = name.substring(0, 1).toUpperCase();

    return (
      <span
        className={`${size} ${colorStyle} rounded-full flex justify-center items-center font-semibold cursor-default`}
      >
        <p className={`${textSize} text-center text-white`}>{avatarName}</p>
      </span>
    );
  }
  return <img className={`${size} rounded-full`} src={avatarUrl} alt="avatar" />;
}

export default Avatar;
