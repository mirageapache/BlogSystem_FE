import React from 'react';
import { useParams } from 'react-router-dom';

type ParamsType = {
  id: string;
};

function PostDetailPage() {
  const { id } = useParams<ParamsType>();

  return (
    <div className="flex flex-col w-full my-5">
      <h2 className="text-2xl border-b-[1px] dark:border-gray-700 pb-4">Title</h2>
      <div className="flex flex-grow w-full border border-green-700">
        <div className="w-full sm:w-60 border border-blue-700">Author Data</div>
        <div className="w-full sm:w-auto grow border border-red-700">Post Content</div>
      </div>
    </div>
  );
}

export default PostDetailPage;
