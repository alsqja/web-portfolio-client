export interface IUserWithToken {
  accessToken: string | null;
  refreshToken: string | null;
  id: string | null;
  name: string | null;
  email: string | null;
}
