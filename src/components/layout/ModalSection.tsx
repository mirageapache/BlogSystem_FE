import React from 'react';
import { useSelector } from 'react-redux';

// --- components ---
import PostCreateModal from 'components/post/PostCreateModal';

// --- functions / types ---
import { PostStateType } from '../../redux/postSlice';

interface StateType {
  post: PostStateType;
}

function ModalSection() {
  const postState = useSelector((state: StateType) => state.post);

  return <div id="modalSection">{postState.showCreateModal && <PostCreateModal />}</div>;
}

export default ModalSection;
