// redux slice reducer 測試（Phase 3.1 Batch B）
// 對應 UPGRADE_PLAN 3.1 第 5 項：每個 reducer 的 state transition。
import sysReducer, {
  setActivePage,
  setExploreTag,
  setEditMode,
  setDarkMode,
  SysStateType,
} from '../redux/sysSlice';
import loginReducer, { setSignInPop, setSignUpPop, setForgetPwd } from '../redux/loginSlice';
import userReducer, { setUserData, clearUserData } from '../redux/userSlice';
import postReducer, {
  setPostId,
  setPostData,
  setShowCreateModal,
  setShowEditModal,
} from '../redux/postSlice';
import { UserProfileType } from '../types/userType';
import { PostDataType } from '../types/postType';

describe('sysSlice', () => {
  const base: SysStateType = {
    darkMode: '',
    editMode: false,
    activePage: 'home',
    exploreTag: 'article',
  };

  test('setActivePage', () => {
    expect(sysReducer(base, setActivePage('explore')).activePage).toBe('explore');
  });
  test('setExploreTag', () => {
    expect(sysReducer(base, setExploreTag('post')).exploreTag).toBe('post');
  });
  test('setEditMode', () => {
    expect(sysReducer(base, setEditMode(true)).editMode).toBe(true);
  });
  test('setDarkMode：空 → dark，並寫入 localStorage', () => {
    const next = sysReducer({ ...base, darkMode: '' }, setDarkMode());
    expect(next.darkMode).toBe('dark');
    expect(localStorage.getItem('darkMode')).toBe('dark');
  });
  test('setDarkMode：dark → 空（toggle 回去）', () => {
    const next = sysReducer({ ...base, darkMode: 'dark' }, setDarkMode());
    expect(next.darkMode).toBe('');
    expect(localStorage.getItem('darkMode')).toBe('');
  });
});

describe('loginSlice', () => {
  const base = { showSignInPop: false, showSignUpPop: false, showForgetPwd: false };
  test('setSignInPop', () => {
    expect(loginReducer(base, setSignInPop(true)).showSignInPop).toBe(true);
  });
  test('setSignUpPop', () => {
    expect(loginReducer(base, setSignUpPop(true)).showSignUpPop).toBe(true);
  });
  test('setForgetPwd', () => {
    expect(loginReducer(base, setForgetPwd(true)).showForgetPwd).toBe(true);
  });
});

describe('userSlice', () => {
  const fakeUser = { _id: 'u1', account: 'user01', name: '小明' } as unknown as UserProfileType;

  test('setUserData 寫入使用者資料', () => {
    expect(userReducer({ userData: null }, setUserData(fakeUser)).userData).toEqual(fakeUser);
  });
  test('clearUserData 清空（登出 / token 失效）', () => {
    expect(userReducer({ userData: fakeUser }, clearUserData()).userData).toBeNull();
  });
});

describe('postSlice', () => {
  // 只需驗證 reducer 寫入行為，postData 以最小物件代替
  const initial = postReducer(undefined, { type: '@@INIT' });
  const fakePost = { _id: 'p1', content: 'hi' } as unknown as PostDataType;

  test('setPostId', () => {
    expect(postReducer(initial, setPostId('p1')).postId).toBe('p1');
  });
  test('setPostData', () => {
    expect(postReducer(initial, setPostData(fakePost)).postData).toEqual(fakePost);
  });
  test('setShowCreateModal', () => {
    expect(postReducer(initial, setShowCreateModal(true)).showCreateModal).toBe(true);
  });
  test('setShowEditModal', () => {
    expect(postReducer(initial, setShowEditModal(true)).showEditModal).toBe(true);
  });
});
