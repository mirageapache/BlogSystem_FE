import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { getPostById } from '../api/post';

import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg';
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg';

function ArticleDetailPage() {
  const { id } = useParams();
  const avatarUrl = '';

  const { isLoading, error, data } = useQuery('posts', () => getPostById(id));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <div className="flex flex-col w-full my-5">
      <h2 className="text-4xl border-b-[1px] dark:border-gray-700 pb-4">{data.title}</h2>
      <div className="flex flex-col w-full">
        <div className="w-full">
          {/* Author Info */}
          <div className="flex my-4">
            <div className="flex justify-center items-center mr-4">
              {isEmpty(avatarUrl) ? (
                <span className="w-11 h-11 rounded-full flex justify-center items-center bg-sky-600 font-semibold">
                  <p className="text-xl text-center text-white">A</p>
                </span>
              ) : (
                <img className="w-11 h-11 rounded-full" src="" alt="author avatar" />
              )}
            </div>
            <div>
              <span className="flex">
                <p className="font-semibold">Author Name</p>｜
                <button type="button" className="hover:font-bold">
                  Follow
                </button>
              </span>
              <span className="flex text-sm text-gary-400">
                <p>5min read</p>｜<p>January 15, 2023</p>
              </span>
            </div>
          </div>
          {/* Article Info */}
          <div className="py-2 mb-5 flex justify-between border-b-[1px] dark:border-gray-700">
            <div className="flex">
              <span className="mr-5 flex justify-center items-center cursor-pointer fill-gray-400 hover:fill-red-400">
                <HeartIcon className="w-6 h-6" />
                <p className="text-md pl-2 font-bold text-center text-gray-400 dark:text-gray-100">
                  5
                </p>
              </span>
              <span className="flex justify-center items-center cursor-pointer fill-gray-400 hover:fill-amber-400">
                <CommentIcon className="w-6 h-6" />
                <p className="text-md pl-2 font-bold text-center text-gray-400 dark:text-gray-100">
                  2
                </p>
              </span>
            </div>
            <div className="flex border border-red-500">right icon</div>
          </div>
        </div>
        <div className="w-full">{data.body}</div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
