import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { SignUp } from 'api/auth';
import Swal from 'sweetalert2';
import SignUpPopup from './SignUpPopup';

// Mock dependencies
jest.mock('api/auth');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));
jest.mock('sweetalert2-react-content', () => jest.fn(() => Swal));

const mockStore = configureStore([]);

describe('SignUpPopup', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      // 初始化您的 Redux store 狀態
    });
    store.dispatch = jest.fn();
  });

  it('renders correctly', () => {
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

  it('shows error messages for empty fields', async () => {
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

  it('shows error when passwords do not match', async () => {
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

  it('calls SignUp API and shows success message on successful registration', async () => {
    SignUp.mockResolvedValue({ status: 200 });

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
