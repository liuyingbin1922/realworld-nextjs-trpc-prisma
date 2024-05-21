import { api, setToken, useIsLoggedIn } from '$/lib/api'
import { getErrorArrayFromTrpcResponseError } from '$/lib/errors'
import { type NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { z } from 'zod'

const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const Login: NextPage = () => {
  const { push } = useRouter()
  const isLoggedIn = useIsLoggedIn()

  // Actions
  const {
    mutate: login,
    isLoading,
    error,
    isError,
  } = api.auth.login.useMutation({
    onSuccess: ({ user }) => {
      setToken(user.token)
      push('/').catch(console.error)
    },
  })

  // If the user is already logged in, redirect to the home page
  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    push('/').catch(console.error)
  }, [push, isLoggedIn])

  const errors = getErrorArrayFromTrpcResponseError(error, isError)

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">登陆</h1>
            <p className="text-xs-center">
              <Link href="/register">没有账号，去注册</Link>
            </p>

            <ul className="error-messages">
              {errors?.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>

            <form
              onSubmit={e => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)

                const body = Object.fromEntries(data.entries())
                const user = LoginSchema.parse(body)

                login({ user })
              }}
            >
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="username"
                  placeholder="用户名"
                  disabled={isLoading}
                  data-testid="input-username"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="密码"
                  disabled={isLoading}
                  data-testid="input-password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right" data-testid="btn-submit">
              登陆
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
