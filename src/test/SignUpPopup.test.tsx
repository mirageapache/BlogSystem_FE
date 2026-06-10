import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';
import Swal from 'sweetalert2';
import configureStore from 'redux-mock-store';
import { SignUp } from '../api/auth';
import SignUpPopup from '../components/login/SignUpPopup';

// vi.mock 工廠會被提升至頂端、無法引用外層變數，以 vi.hoisted 建立共用 mock Swal 實例。
const { mockSwal } = vi.hoisted(() => ({
  mockSwal: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

vi.mock('../api/auth', () => ({
  SignUp: vi.fn(),
}));

vi.mock('sweetalert2', () => ({ default: mockSwal }));
vi.mock('sweetalert2-react-content', () => ({ default: vi.fn(() => mockSwal) }));

const mockStore = configureStore([]);
const mockedSignUp = vi.mocked(SignUp);

describe('註冊功能(SignUp)', () => {
  let store: Store<unknown, AnyAction>;

  beforeEach(() => {
    store = mockStore({}); // 初始化 Redux store 狀態
    store.dispatch = vi.fn();
  });

  test('元件顯示', () => {
    render(
      <Provider store={store}>
        <SignUpPopup />
      </Provider>
    );

    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密碼')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('確認密碼')).toBeInTheDocument();
    expect(screen.getByText('註冊')).toBeInTheDocument();
  });

  test('測試表單欄位必填', async () => {
    render(
      <Provider store={store}>
        <SignUpPopup />
      </Provider>
    );

    fireEvent.click(screen.getByText('註冊'));

    await waitFor(() => {
      expect(screen.getByText('Email為必填欄位')).toBeInTheDocument();
    });
  });

  test('測試密碼與確認密碼不相符', async () => {
    render(
      <Provider store={store}>
        <SignUpPopup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密碼'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('確認密碼'), { target: { value: 'password456' } });

    fireEvent.click(screen.getByText('註冊'));

    await waitFor(() => {
      expect(screen.getByText('確認密碼與密碼不相符')).toBeInTheDocument();
    });
  });

  test('測試註冊成功行為', async () => {
    mockedSignUp.mockResolvedValue({ status: 200 });

    render(
      <Provider store={store}>
        <SignUpPopup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('密碼'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('確認密碼'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('註冊'));

    await waitFor(() => {
      expect(SignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(Swal.fire).toHaveBeenCalledWith({
        title: '註冊成功🎉',
        text: '歡迎加入ReactBlog',
        icon: 'success',
        confirmButtonText: '確認',
      });
    });
  });
});
