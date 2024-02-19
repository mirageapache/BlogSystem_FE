import React from 'react';
import { isEmpty } from 'lodash';

function Avatar(props: { avatarUrl: string}) {
  const { avatarUrl } = props;
  return (
    <div>
      {isEmpty(avatarUrl) ? (
        <span className="w-11 h-11 rounded-full flex justify-center items-center bg-sky-600 font-semibold">
          <p className="text-xl text-center text-white">A</p>
        </span>
      ) : (
        <img className="w-11 h-11 rounded-full" src={avatarUrl} alt="author avatar" />
      )}
    </div>
  );
}

export default Avatar;
