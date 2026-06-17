// zod schema 邊界值測試（Phase 3.1 Batch B）
// 對應 UPGRADE_PLAN 3.1 第 2 項：剛好 5 / 6 / 20 / 21 字等邊界。
import { z } from 'zod';
import { signInSchema, signUpSchema, findPwdSchema, resetPwdSchema } from '../schemas/auth';
import { editProfileSchema } from '../schemas/user';

/** 取得指定欄位的第一個錯誤訊息（safeParse 失敗時） */
function errorFor(schema: z.ZodTypeAny, data: unknown, field: string): string | undefined {
  const result = schema.safeParse(data);
  if (result.success) return undefined;
  return result.error.issues.find((i) => i.path[0] === field)?.message;
}

const validEmail = 'user@example.com';

describe('schemas/auth', () => {
  describe('signInSchema', () => {
    test('email 空字串 → 必填訊息', () => {
      expect(errorFor(signInSchema, { email: '', password: 'password' }, 'email')).toBe(
        'Email為必填欄位'
      );
    });

    test('email 非空但格式錯誤 → 格式訊息（必填先於格式）', () => {
      expect(errorFor(signInSchema, { email: 'not-an-email', password: 'password' }, 'email')).toBe(
        'Email格式錯誤'
      );
    });

    test('密碼 5 字（低於下界）→ 長度訊息', () => {
      expect(errorFor(signInSchema, { email: validEmail, password: '12345' }, 'password')).toBe(
        '密碼長度須介於6至20字元'
      );
    });

    test('密碼剛好 6 字 → 通過', () => {
      expect(signInSchema.safeParse({ email: validEmail, password: '123456' }).success).toBe(true);
    });

    test('密碼剛好 20 字 → 通過', () => {
      expect(signInSchema.safeParse({ email: validEmail, password: 'a'.repeat(20) }).success).toBe(
        true
      );
    });

    test('密碼 21 字（超過上界）→ 長度訊息', () => {
      expect(
        errorFor(signInSchema, { email: validEmail, password: 'a'.repeat(21) }, 'password')
      ).toBe('密碼長度須介於6至20字元');
    });

    test('合法輸入 → 通過', () => {
      expect(signInSchema.safeParse({ email: validEmail, password: 'password123' }).success).toBe(
        true
      );
    });
  });

  describe('signUpSchema', () => {
    test('密碼與確認密碼不符 → confirmPassword 錯誤', () => {
      expect(
        errorFor(
          signUpSchema,
          { email: validEmail, password: 'password123', confirmPassword: 'password456' },
          'confirmPassword'
        )
      ).toBe('確認密碼與密碼不相符');
    });

    test('密碼一致 → 通過', () => {
      expect(
        signUpSchema.safeParse({
          email: validEmail,
          password: 'password123',
          confirmPassword: 'password123',
        }).success
      ).toBe(true);
    });
  });

  describe('findPwdSchema', () => {
    test('email 空 → 必填', () => {
      expect(errorFor(findPwdSchema, { email: '' }, 'email')).toBe('Email為必填欄位');
    });
    test('合法 email → 通過', () => {
      expect(findPwdSchema.safeParse({ email: validEmail }).success).toBe(true);
    });
  });

  describe('resetPwdSchema', () => {
    test('不一致 → confirmPassword 錯誤', () => {
      expect(
        errorFor(
          resetPwdSchema,
          { password: 'password123', confirmPassword: 'nope' },
          'confirmPassword'
        )
      ).toBe('確認密碼與密碼不相符');
    });
    test('一致 → 通過', () => {
      expect(
        resetPwdSchema.safeParse({ password: 'password123', confirmPassword: 'password123' })
          .success
      ).toBe(true);
    });
  });
});

describe('schemas/user editProfileSchema', () => {
  const validProfile = {
    email: validEmail,
    account: 'user01',
    name: '小明',
    bio: '',
    language: 'zh',
    emailPrompt: true,
    mobilePrompt: false,
  };

  test('完整合法資料 → 通過', () => {
    expect(editProfileSchema.safeParse(validProfile).success).toBe(true);
  });

  test('email 空 → 必填（注意訊息與 auth 不同）', () => {
    expect(errorFor(editProfileSchema, { ...validProfile, email: '' }, 'email')).toBe(
      'Email欄位必填'
    );
  });

  test('account 空 → 必填', () => {
    expect(errorFor(editProfileSchema, { ...validProfile, account: '' }, 'account')).toBe(
      '帳號欄位必填'
    );
  });

  test('name 空 → 必填', () => {
    expect(errorFor(editProfileSchema, { ...validProfile, name: '' }, 'name')).toBe('名稱欄位必填');
  });

  test('bio 剛好 200 字 → 通過', () => {
    expect(editProfileSchema.safeParse({ ...validProfile, bio: '字'.repeat(200) }).success).toBe(
      true
    );
  });

  test('bio 201 字 → 超過上限訊息', () => {
    expect(errorFor(editProfileSchema, { ...validProfile, bio: '字'.repeat(201) }, 'bio')).toBe(
      '自我介紹最多200字'
    );
  });
});
