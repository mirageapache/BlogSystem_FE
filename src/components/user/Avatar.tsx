import React from 'react';
import { isEmpty } from 'lodash';

function Avatar(props: { avatarUrl: string; size: string; textSize: string }) {
  const { avatarUrl, size, textSize } = props;
  return (
    <div>
      {isEmpty(avatarUrl) ? (
        <span
          className={`${size} rounded-full flex justify-center items-center bg-sky-600 font-semibold`}
        >
          <p className={`${textSize} text-center text-white`}>A</p>
        </span>
      ) : (
        <img className={`${size} rounded-full`} src={avatarUrl} alt="author avatar" />
      )}
    </div>
  );
}

export default Avatar;
