import React, { useEffect, useRef, useState } from 'react';
import { get, isEmpty } from 'lodash';
// --- components ---
import NoSearchResult from 'components/tips/NoSearchResult';
import PostItem from './PostItem';
import BasicErrorPanel from '../tips/BasicErrorPanel';
import PostListLoading from './PostListLoading';
// --- types ---
import { PostDataType, PostResultType } from '../../types/postType';

function PostListDynamic(props: { postListData: PostResultType; isLoading: boolean }) {
  const loadingBar = useRef(null); // 判斷是否進行載入新資料(refetch)
  const { postListData, isLoading } = props;
  const { data } = postListData;
  const postDataList: PostDataType[] | null = get(data, 'posts', []) as PostDataType[] | null;
  const currentPage = get(data, 'currentPage', 1);

  console.log(data);
  // useEffect(() => {
  //   setPostList((prevData) => [...prevData, data]);
  // }, [currentPage]);

  // if (isLoading) return <PostListLoading />;
  if (!isEmpty(data) && data.code === 'ERR_NETWORK')
    return <BasicErrorPanel errorMsg="與伺服器連線異常，請稍候再試！" />;
  if (isEmpty(postDataList))
    return <NoSearchResult msgOne="搜尋不到相關貼文" msgTwo="" type="post" />;

  const postItems = postDataList!.map((post) => {
    return <PostItem key={post._id} postData={post} />;
  });

  console.log(typeof postItems);

  return (
    <section className="w-full">
      <div>{postItems}</div>
      <div ref={loadingBar} />
      {isLoading && <PostListLoading />}
    </section>
  );
}

export default PostListDynamic;
