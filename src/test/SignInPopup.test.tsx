import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { SignIn } from '../api/auth';
import SignInPopup from '../components/login/SignInPopup';

// vitest 的 vi.mock 工廠會被提升至檔案頂端，無法引用外層變數（jest 的 mock 前綴例外在此不適用），
// 故以 vi.hoisted 建立共用的 mock Swal 實例供兩個 mock 工廠取用。
const { mockSwal } = vi.hoisted(() => ({
  mockSwal: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

vi.mock('../api/auth', () => ({
  SignIn: vi.fn(),
}));

vi.mock('sweetalert2', () => ({ default: mockSwal }));
vi.mock('sweetalert2-react-content', () => ({ default: vi.fn(() => mockSwal) }));

const mockStore = configureStore([]);
const mockedSignIn = vi.mocked(SignIn);

describe('登入功能(SignIn)', () => {
  let store: Store<unknown, AnyAction>;
  beforeEach(() => {
    store = mockStore({});
    store.dispatch = vi.fn();
  });

  test('登入元件顯示', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignInPopup />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('登入')).toBeInTheDocument();
  });

  test('測試表單欄位必填', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignInPopup />
        </MemoryRouter>
      </Provider>
    );
    userEvent.click(screen.getByText('登入'));
    await waitFor(() => {
      expect(screen.getByText('Email為必填欄位')).toBeInTheDocument();
    });
  });

  test('測試登入成功行為', async () => {
    mockedSignIn.mockResolvedValue({
      status: 200,
      data: {
        authToken: 'mockAuthToken',
        userData: { userId: 'mockUserId' },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignInPopup />
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('password'), 'password123');
    await userEvent.click(screen.getByText('登入'));

    await waitFor(() => {
      expect(SignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(Swal.fire).toHaveBeenCalledWith({
        title: '登入成功',
        icon: 'success',
        confirmButtonText: '確認',
        timer: 2000,
        timerProgressBar: true,
      });
    });
  });
});
