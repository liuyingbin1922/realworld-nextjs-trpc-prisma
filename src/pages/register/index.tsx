import { api, setToken, useIsLoggedIn } from '$/lib/api'
import { getErrorArrayFromTrpcResponseError } from '$/lib/errors'
import { type NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { z } from 'zod'

const RegisterSchema = z.object({
  username: z.string(),
  // email: z.string(),
  password: z.string(),
})

const Login: NextPage = () => {
  const { push } = useRouter()
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    push('/').catch(console.error)
  }, [push, isLoggedIn])

  const {
    mutate: register,
    isLoading,
    error,
    isError,
  } = api.auth.register.useMutation({
    onSuccess: ({ user }) => {
      setToken(user.token)
      push('/').catch(console.error)
    },
  })

  const errors = getErrorArrayFromTrpcResponseError(error, isError)

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">用户注册</h1>
            <p className="text-xs-center">
              <Link href="/login">已有账号，点击登录</Link>
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
                const user = RegisterSchema.parse(body)

                register({ user })
              }}
            >
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="用户名"
                  name="username"
                  disabled={isLoading}
                />
              </fieldset>
              {/* <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="邮箱"
                  name="email"
                  disabled={isLoading}
                />
              </fieldset> */}
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="密码"
                  name="password"
                  disabled={isLoading}
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">注册</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
