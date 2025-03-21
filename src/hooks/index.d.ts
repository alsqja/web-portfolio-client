export interface IUserWithToken {
  token: string | null;
  refreshToken: string | null;
  id: string | null;
  name: string | null;
  email: string | null;
}
