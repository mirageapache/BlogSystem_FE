import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPostById } from '../api/post';

function PostDetailPage() {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery('posts', () => getPostById(id));
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <div className="flex flex-col w-full my-5">
      <h2 className="text-2xl border-b-[1px] dark:border-gray-700 pb-4">{data.title}</h2>
      <div className="flex flex-col sm:flex-row flex-grow w-full border border-green-700">
        <div className="w-full sm:min-w-60 sm:w-60 border border-blue-700">Author Data</div>
        <div className="w-full sm:w-auto grow border border-red-700">{data.body}</div>
      </div>
    </div>
  );
}

export default PostDetailPage;
