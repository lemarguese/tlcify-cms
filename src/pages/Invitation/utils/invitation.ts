import { useCallback, useState } from "react";
import type { BaseSyntheticEvent } from 'react';

import type { IUser } from "@/types/user/main.ts";
import { instance } from "@/api/axios.ts";
import { useNotify } from "@/hooks/useNotify/useNotify.tsx";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";

const invitationFormInitialState: Pick<IUser, 'firstName' | 'lastName'> & {
  password: string;
  confirmPassword: string
} = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: ''
}

export const getInvitationFunction = (invitationToken?: string) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { error, success } = useNotify();

  const [invitationForm, setInvitationForm] = useState(invitationFormInitialState);

  const changeInput = useCallback((key: 'firstName' | 'lastName' | 'password' | 'confirmPassword') => {
    return (value: BaseSyntheticEvent) => {
      setInvitationForm(prev => ({
        ...prev,
        [key]: value.target.value
      }))
    }
  }, []);

  const updateUser = async () => {
    try {
      setLoading(true);

      await instance.patch(`/user/${invitationToken}`, {
        firstName: invitationForm.firstName.trim(),
        lastName: invitationForm.lastName.trim(),
        password: invitationForm.password.trim(),
      });

      success('🎉 You successfully registered to the platform!');
      navigate('/login');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg =
        axiosErr.response?.data?.message || axiosErr.message || 'Something went wrong';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (invitationForm.password !== invitationForm.confirmPassword) {
      error('Passwords do not match!');
      return;
    }

    await updateUser();
  };

  return {
    submit,
    invitationForm,
    changeInput,
    loading
  }
}
