import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useRouter: (): any => ({ asPath: '/' })
}));

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // noop
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});
