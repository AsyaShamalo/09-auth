'use client'

import css from './SignUpPage.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';
import {register, RegisterRequest} from '@/lib/api/clientApi'


const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const handleRegister = async (formData: FormData) => {
    try {
      const fromValues = Object.fromEntries(formData.entries()) as RegisterRequest;
      const res = await register(fromValues);
      if(res) {
        setUser(res)
        router.push('/profile');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    }
  }
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleRegister}>
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
        Register
      </button>
    </div>

    {error &&  <p className={css.error}>{error}</p>}
  </form>
</main>
)

}

export default SignUp;