import React from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';

function PostTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-3">
      <a href="/" className="font-bold">
        {text.toUpperCase()}
      </a>
    </span>
  );
}

interface PostType {
  id: number;
  title: string;
  tags: string[];
  body: string;
}

function PostItem({ id, title, body, tags }: PostType) {
  const tagsList = tags.map((tag) => <PostTag key={`${tag}-${id}`} text={tag} />);

  return (
    <div className="text-left border-b-[1px] dark:border-gray-700 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <div className="flex">
        <div className="mr-3">
          {isEmpty(true) ? (
            <span className="w-11 h-11 rounded-full flex justify-center items-center bg-sky-600 font-semibold">
              <p className="text-xl text-center text-white">A</p>
            </span>
          ) : (
            <img className="w-11 h-11 rounded-full" src="" alt="author avatar" />
          )}
        </div>
        <div className="">
          <div className="flex">
            <p className="text-gray-600">James</p>
            <p className="text-gray-600 dark:text-gray-300 my-1">2024年1月1日</p>
          </div>
          <div>
            <h2 className="font-semibold text-2xl xl:text-3xl">
              <Link to={`/post/${id}`}>{title}</Link>
            </h2>
            <div className="text-orange-500">{tagsList}</div>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
