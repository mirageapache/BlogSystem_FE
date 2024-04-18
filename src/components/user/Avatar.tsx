import React from 'react';
import { isEmpty } from 'lodash';

function Avatar(props: { name: string; avatarUrl: string; size: string; textSize: string }) {
  const { name, avatarUrl, size, textSize } = props;

  if (isEmpty(avatarUrl)) {
    const avatarName = name.substring(0, 1).toUpperCase();

    return (
      <span
        className={`${size} rounded-full flex justify-center items-center bg-sky-600 font-semibold`}
      >
        <p className={`${textSize} text-center text-white`}>{avatarName}</p>
      </span>
    );
  } else {
    return <img className={`${size} rounded-full`} src={avatarUrl} alt="author avatar" />;
  }
}

export default Avatar;
