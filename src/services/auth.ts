// Auth service stub. Phase 2 will replace with real Supabase auth.
export interface AuthUser {
  id: string;
  email: string;
}

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    return null;
  },
  async signIn(_email: string, _password: string): Promise<AuthUser | null> {
    return null;
  },
  async signOut(): Promise<void> {
    return;
  },
};
