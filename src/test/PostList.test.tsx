import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostListDynamic from '../components/post/PostListDynamic';
import PostItem from '../components/post/PostItem';
import { mockData } from './mockData';

jest.mock('../components/post/PostItem', () => jest.fn(() => <div>Post Item</div>));

describe('測試PostList元件', () => {
  test('測試貼文 loading 狀態', () => {
    render(<PostListDynamic postListData={[]} isLoading atBottom={false} />);
    const loadingElements = screen.getAllByLabelText('loading animation');
    expect(loadingElements.length).toBeGreaterThan(0); // 確認至少有一個<PostLoading>
  });

  test('測試貼文清單顯示', () => {
    render(<PostListDynamic postListData={mockData} isLoading={false} atBottom={false} />);
    // 檢查渲染的 PostItem 元素數量是否與 mockPostData 長度一致
    expect(screen.getAllByText('Post Item').length).toBe(mockData.length);

    mockData.forEach((post) => {
      // 驗證每個 PostItem 是否接收到正確的 props
      expect(PostItem).toHaveBeenCalledWith({ postData: post }, {});
    });
  });

  test('測試沒有更多貼文顯示', () => {
    render(<PostListDynamic postListData={mockData} isLoading={false} atBottom />);
    expect(screen.getByText('- 已經沒有更多貼文了 -')).toBeInTheDocument();
  });
});
