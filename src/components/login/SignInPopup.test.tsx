import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import Swal from 'sweetalert2';
import { SignIn } from '../../api/auth';
import SignInPopup from './SignInPopup';

jest.mock('../../api/auth', () => ({
  SignIn: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));
const mockSwal = Swal;
jest.mock('sweetalert2-react-content', () => jest.fn(() => mockSwal));

const mockStore = configureStore([]);
const mockedSignIn = SignIn as jest.Mock;

describe('登入功能(SignIn)', () => {
  let store: Store<unknown, AnyAction>;
  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
  });

  test('登入元件顯示', () => {
    render(
      <Provider store={store}>
        <SignInPopup />
      </Provider>
    );

    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('登入')).toBeInTheDocument();
  });

  test('測試表單欄位必填', async () => {
    render(
      <Provider store={store}>
        <SignInPopup />
      </Provider>
    );
    userEvent.click(screen.getByText('登入'));
    await waitFor(() => {
      expect(screen.getByText('Email為必填欄位')).toBeInTheDocument();
    });
  });

  test('測試登入成功行為', async () => {
    mockedSignIn.mockResolvedValue({ status: 200 });

    render(
      <Provider store={store}>
        <SignInPopup />
      </Provider>
    );

    userEvent.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('password'), 'password123');
    userEvent.click(screen.getByText('登入'));

    await waitFor(() => {
      expect(SignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(Swal.fire).toHaveBeenCalledWith({
        title: '登入成功',
        text: '歡迎回來ReactBlog',
        icon: 'success',
      });
    });
  });
});
