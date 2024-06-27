import React from 'react';
import { useSelector } from 'react-redux';

// --- components ---
import PostCreateModal from 'components/post/PostCreateModal';
import PostEditModal from 'components/post/PostEditModal';

// --- functions / types ---
import { PostStateType } from '../../redux/postSlice';

interface StateType {
  post: PostStateType;
}

function ModalSection() {
  const postState = useSelector((state: StateType) => state.post);

  return (

    <div id="modalSection">
      {/* 建立貼文 */}
      {postState.showCreateModal && <PostCreateModal />}

      {/* 編輯貼文 */}
      {postState.showEditModal && <PostEditModal />}
    </div>
  )
}

export default ModalSection;
