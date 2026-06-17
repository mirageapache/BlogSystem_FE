import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
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
          className={`${size} ${colorStyle} rounded-full flex justify-center items-center font-semibold cursor-default ring-1 ring-line`}
        >
          <p className={`${textSize} text-center text-white`}>{avatarName}</p>
        </span>
      );
    }
    return (
      <span
        className={`${size} rounded-full flex justify-center items-center bg-surface-2 ring-1 ring-line`}
      >
        <FontAwesomeIcon icon={faUser} className="w-1/2 h-1/2 text-muted" />
      </span>
    );
  }
  return (
    <img
      className={`${size} rounded-full object-cover ring-1 ring-line`}
      src={avatarUrl}
      alt="avatar"
    />
  );
}

export default Avatar;
