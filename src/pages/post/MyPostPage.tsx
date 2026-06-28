import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { POST_STATUS, ERR_NETWORK_MSG } from 'constants/StringConstants';
import { getMyPostList, updatePost, deletePost } from 'api/post';
import { errorAlert, handleApiError, handleStatus } from 'utils/fetch';
import { PostDataType } from 'types/postType';
import { UserStateType } from 'redux/userSlice';
import BasicErrorPanel from 'components/tips/BasicErrorPanel';

interface StateType {
  user: UserStateType;
}

const TABS = [
  { label: '全部', status: undefined },
  { label: '草稿', status: POST_STATUS.DRAFT },
  { label: '已發佈', status: POST_STATUS.PUBLIC },
  { label: '已下架', status: POST_STATUS.OFFLINE },
] as const;

const STATUS_LABEL: Record<number, string> = {
  [POST_STATUS.DRAFT]: '草稿',
  [POST_STATUS.PUBLIC]: '公開',
  [POST_STATUS.MEMBER]: '限閱',
  [POST_STATUS.OFFLINE]: '已下架',
};

const STATUS_COLOR: Record<number, string> = {
  [POST_STATUS.DRAFT]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [POST_STATUS.PUBLIC]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [POST_STATUS.MEMBER]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [POST_STATUS.OFFLINE]: 'bg-surface-2 text-muted',
};

/** 將 HTML 字串轉為純文字預覽 */
function stripHtml(html: string, maxLen = 80): string {
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

function MyPostPage() {
  const [activeStatus, setActiveStatus] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const swal = withReactContent(Swal);
  const userId = useSelector((state: StateType) => state.user.userData?.userId);

  const { data, isLoading } = useQuery({
    queryKey: ['myPostList', activeStatus, page],
    queryFn: () => getMyPostList(page, 20, activeStatus),
    enabled: !!userId,
  });

  const posts: PostDataType[] = get(data, 'posts', []);
  const nextPage: number = get(data, 'nextPage', -1);
  const isNetworkError = get(data, 'code') === 'ERR_NETWORK';

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: ['myPostList'] });

  const changeStatusMutation = useMutation({
    mutationFn: ({ post, newStatus }: { post: PostDataType; newStatus: number }) => {
      const fd = new FormData();
      fd.set('postId', post._id);
      fd.set('content', post.content);
      fd.set('status', String(newStatus));
      if (post.hashTags?.length) fd.set('hashTags', JSON.stringify(post.hashTags));
      return updatePost(fd);
    },
    onSuccess: (res, { newStatus }) => {
      if (handleStatus(get(res, 'status')) === 2) {
        invalidateList();
        swal.fire({
          title: newStatus === POST_STATUS.PUBLIC ? '貼文已發佈' : '貼文已下架',
          icon: 'success',
          confirmButtonText: '確認',
        });
      } else if (handleStatus(get(res, 'status')) === 4) {
        handleApiError(res);
      } else if (get(res, 'code') === 'ERR_NETWORK') {
        errorAlert(ERR_NETWORK_MSG);
      }
    },
    onError: () => errorAlert(),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (res) => {
      if (handleStatus(get(res, 'status')) === 2) {
        invalidateList();
      } else if (handleStatus(get(res, 'status')) === 4) {
        handleApiError(res);
      } else if (get(res, 'code') === 'ERR_NETWORK') {
        errorAlert(ERR_NETWORK_MSG);
      }
    },
    onError: () => errorAlert(),
  });

  const handleDelete = (postId: string) => {
    swal
      .fire({
        title: '確定要刪除此貼文嗎？',
        text: '確定後會立即刪除貼文',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消',
      })
      .then((result) => {
        if (result.isConfirmed) deleteMutation.mutate(postId);
      });
  };

  const handleTabChange = (status: number | undefined) => {
    setActiveStatus(status);
    setPage(1);
  };

  if (!userId) {
    return (
      <div className="w-full max-w-[700px] p-4 text-center text-muted">請先登入才能查看貼文</div>
    );
  }

  return (
    <div className="w-full max-w-[700px] mt-4 p-2 sm:p-0">
      <div className="flex justify-between items-center mb-4 px-2">
        <h1 className="text-3xl font-bold">我的貼文</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeStatus === tab.status
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            onClick={() => handleTabChange(tab.status)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 貼文清單 */}
      {isLoading && <div className="text-center text-muted py-8">載入中...</div>}

      {!isLoading && isNetworkError && <BasicErrorPanel errorMsg={ERR_NETWORK_MSG} />}

      {!isLoading && !isNetworkError && posts.length === 0 && (
        <div className="text-center text-muted py-8">
          {activeStatus === POST_STATUS.DRAFT ? '沒有草稿' : '沒有符合條件的貼文'}
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="flex items-start justify-between p-3 mb-2 rounded-lg border border-line hover:bg-surface-2 transition-colors"
        >
          {/* 貼文資訊 */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => navigate(`/post/${post._id}`)}
            aria-hidden
          >
            <p className="text-sm text-ink truncate">{stripHtml(post.content)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[post.status] ?? STATUS_COLOR[POST_STATUS.OFFLINE]}`}
              >
                {STATUS_LABEL[post.status] ?? '未知'}
              </span>
              <span className="text-xs text-muted">{post.createdAt?.slice(0, 10)}</span>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-2 ml-3 shrink-0">
            {post.status === POST_STATUS.DRAFT && (
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-brand text-brand hover:bg-brand hover:text-white transition-colors"
                onClick={() => changeStatusMutation.mutate({ post, newStatus: POST_STATUS.PUBLIC })}
              >
                發佈
              </button>
            )}
            {(post.status === POST_STATUS.PUBLIC || post.status === POST_STATUS.MEMBER) && (
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-line text-muted hover:bg-surface-2 transition-colors"
                onClick={() =>
                  changeStatusMutation.mutate({ post, newStatus: POST_STATUS.OFFLINE })
                }
              >
                下架
              </button>
            )}
            {post.status === POST_STATUS.OFFLINE && (
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-brand text-brand hover:bg-brand hover:text-white transition-colors"
                onClick={() => changeStatusMutation.mutate({ post, newStatus: POST_STATUS.PUBLIC })}
              >
                重新發佈
              </button>
            )}
            <button
              type="button"
              className="text-xs px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={() => handleDelete(post._id)}
            >
              刪除
            </button>
          </div>
        </div>
      ))}

      {/* 分頁 */}
      {(page > 1 || nextPage > 0) && (
        <div className="flex justify-center gap-4 mt-4 pb-4">
          <button
            type="button"
            className="px-3 py-1 rounded border border-line text-sm disabled:opacity-40"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            上一頁
          </button>
          <span className="py-1 text-sm text-muted">第 {page} 頁</span>
          <button
            type="button"
            className="px-3 py-1 rounded border border-line text-sm disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
            disabled={nextPage < 0}
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
}

export default MyPostPage;
