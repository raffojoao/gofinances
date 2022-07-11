import { renderHook, act } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "./auth";

jest.mock('expo-auth-session', () => {
  return { startAsync: () => {
    return {
      type: 'success',
      params: {
        access_token: 'google-token'
      }
    }
  }}
})

describe("Auth hook tests", () => {
  it("should be able to sign in with existing google account", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({
        id: `userInfo.od`,
        email: 'userInfo,email',
        name: 'userInfo.name',
        photo: 'userInfo.photo',
        locale: 'userInfo.locale',
        verified_email: 'userInfo.verified_email'
      })
    })) as jest.Mock;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).toBeTruthy();
  });
});
