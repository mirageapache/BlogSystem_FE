import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPostById } from '../api/post';
import { isEmpty } from 'lodash';

function PostDetailPage() {
  const { id } = useParams();
  const avatarUrl = '';
  
  const { isLoading, error, data } = useQuery('posts', () => getPostById(id));
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <div className="flex flex-col w-full my-5">
      <h2 className="text-4xl border-b-[1px] dark:border-gray-700 pb-4">{data.title}</h2>
      <div className="flex flex-col w-full">
        <div className="w-full border border-blue-700">
          <div className="flex my-4">
            <div className="flex justify-center items-center mr-4">
              {isEmpty(avatarUrl) ?
                <span className="w-11 h-11 rounded-full flex justify-center items-center bg-sky-600 font-semibold">
                  <p className="text-xl text-center text-white">A</p>
                </span>
              :
                <img className="w-11 h-11 rounded-full" src="" alt="author avatar" />
              }
            </div>
            <div>
              <span className="flex">
                <p className="font-semibold">Author Name</p>｜
                <button className="hover:font-bold">Follow</button>
              </span>
              <span className="flex text-sm text-gary-400">
                <p>5min read</p>｜
                <p>January 15, 2023</p>
              </span>
            </div>
          </div>
          <div className="">state</div>
        </div>
        <div className="w-full">{data.body}</div>
      </div>
    </div>
  );
}

export default PostDetailPage;
