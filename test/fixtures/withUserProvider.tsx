/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { UserProfile, UserProvider, UserProviderProps } from '@auth0/nextjs-auth0';
import React from 'react';

// source: https://github.com/auth0/nextjs-auth0/blob/main/tests/fixtures/frontend.tsx

type FetchUserMock = {
  ok: boolean;
  json?: () => Promise<UserProfile>;
};

export const user: UserProfile = {
  email: 'foo@example.com',
  email_verified: true,
  name: 'foo',
  nickname: 'foo',
  picture: 'foo.jpg',
  sub: '1',
  updated_at: null
};

export const withUserProvider = ({ user, profileUrl, loginUrl }: UserProviderProps = {}): React.ComponentType => {
  return (props: any): React.ReactElement => (
    <UserProvider {...props} user={user} profileUrl={profileUrl} loginUrl={loginUrl} />
  );
};

export const fetchUserMock = (): Promise<FetchUserMock> => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(user)
  });
};

export const fetchUserUnsuccessfulMock = (): Promise<FetchUserMock> => {
  return Promise.resolve({
    ok: false
  });
};

export const fetchUserErrorMock = (): Promise<FetchUserMock> => Promise.reject(new Error('Error'));
