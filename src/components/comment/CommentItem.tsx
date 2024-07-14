/* eslint-disable react/no-danger */
import React from 'react';
import { CommentDataType } from 'types/commentType';

// --- components ---
import Avatar from 'components/user/Avatar';
import { get } from 'lodash';
import { formatDateTime } from 'utils/dateTime';
import { Link } from 'react-router-dom';

function CommentItem(props: { commentData: CommentDataType }) {
  const { commentData } = props;
  const { _id, name, avatar, bgColor } = get(commentData, 'author');

  return (
    <div className="mb-4">
      <div className="flex">
        <div className="mr-2">
          <Avatar
            name={name}
            avatarUrl={avatar}
            size="w-11 h-11"
            textSize="text-xl"
            bgColor={bgColor}
          />
        </div>
        <div>
          <span className="flex gap-2">
            <Link to={`/user/profile/${_id}`} className="hover:text-orange-500 cursor-pointer">
              <p className="text-lg">{name}</p>
            </Link>
            <p className="text-gray-500">{formatDateTime(commentData.createdAt)}</p>
          </span>
          <div dangerouslySetInnerHTML={{ __html: commentData.content }} />
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
