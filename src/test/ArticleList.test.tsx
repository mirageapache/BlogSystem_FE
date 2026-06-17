import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArticleListDynamic from '../components/article/ArticleListDynamic';
import ArticleItem from '../components/article/ArticleItem';
import { mockData } from './mockData';

vi.mock('../components/article/ArticleItem', () => ({
  default: vi.fn(() => <div>Article Item</div>),
}));

describe('測試ArticleList元件', () => {
  test('測試文章 loading 狀態', () => {
    render(<ArticleListDynamic articleListData={[]} isLoading atBottom={false} />);
    const loadingElements = screen.getAllByLabelText('loading animation');
    expect(loadingElements.length).toBeGreaterThan(0); // 確認至少有一個<ArticleLoading>
  });

  test('測試文章清單顯示', () => {
    render(<ArticleListDynamic articleListData={mockData} isLoading={false} atBottom={false} />);
    // 檢查渲染的 ArticleItem 元素數量是否與 mockData 長度一致
    expect(screen.getAllByText('Article Item').length).toBe(mockData.length);

    mockData.forEach((article, index) => {
      // 驗證每個 ArticleItem 是否接收到正確的 props
      // React 19 以單一參數 (props) 呼叫函式元件（移除了舊版 legacy context 第二參數），
      // 故只比對第一個參數，避免斷言參數數量。
      expect(vi.mocked(ArticleItem).mock.calls[index][0]).toEqual({ articleData: article });
    });
  });

  test('測試沒有更多文章顯示', () => {
    render(<ArticleListDynamic articleListData={mockData} isLoading={false} atBottom />);
    expect(screen.getByText('- 已經沒有更多文章了 -')).toBeInTheDocument();
  });
});
