import { useSession, signIn, signUp, signOut } from '@/lib/auth-client'

export function useAuth() {
  const { data: session, isPending, error } = useSession()

  const loginWithEmail = async (email: string, password: string) => {
    return await signIn.email({
      email,
      password,
    })
  }

  const registerWithEmail = async (email: string, password: string, name: string) => {
    return await signUp.email({
      email,
      password,
      name,
    })
  }

  const loginWithGoogle = async () => {
    return await signIn.social({
      provider: "google",
      callbackURL: "/",
    })
  }

  const loginWithGithub = async () => {
    return await signIn.social({
      provider: "github",
      callbackURL: "/",
    })
  }

  const logout = async () => {
    return await signOut()
  }

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithGithub,
    logout,
  }
}

