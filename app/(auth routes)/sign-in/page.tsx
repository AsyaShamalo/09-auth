'use client'

import { useState } from 'react';
import css from './SignInPage.module.css'
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { login, LoginRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const SignIn = () => {
    const setUser  = useAuthStore(state => state.setUser);
    const router = useRouter();
    const [error, setError] = useState('');
    const handleLogin = async (formData: FormData) => {
        try {
            const fromValues = Object.fromEntries(formData.entries()) as LoginRequest;
            const res = await login(fromValues);
            if(res) {
                setUser(res);
                router.push('/profile');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data?.message || 'An error occurred. Please try again.');
            }
        }
    }
    return (<main className={css.mainContent}>
 <form className={css.form} action={handleLogin}>
    <h1 className={css.formTitle}>Sign in</h1>

    <div className={css.formGroup}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" className={css.input} required />
    </div>

    <div className={css.formGroup}>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" className={css.input} required />
    </div>

    <div className={css.actions}>
      <button type="submit" className={css.submitButton}>
        Log in
      </button>
    </div>

    {error && <p className={css.error}>{error}</p>}
  </form>
</main>
)
}

export default SignIn