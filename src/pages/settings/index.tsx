import { Layout } from '$/components/Layout'
import { api, isLoggedIn, setToken } from '$/lib/api'
import { getErrorArrayFromTrpcResponseError } from '$/lib/errors'
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { z } from 'zod'

const UserSchema = z.object({
  username: z.string(),
  description: z.string(),
  bio: z.string(),
  image: z.string(),
  password: z.string(),
})

const Login: NextPage = () => {
  const ctx = api.useContext()
  const { push } = useRouter()

  // Data
  const { data: userData } = api.auth.me.useQuery(undefined, {
    enabled: isLoggedIn(),
  })
  const user = userData?.user

  // Actions
  const {
    mutate: updateUser,
    error,
    isError,
    isLoading,
  } = api.auth.updateUser.useMutation({ onSuccess: () => ctx.auth.me.invalidate() })

  if (!user) {
    return (
      <Layout privateRoute>
        <div className="settings-page">
          <div className="container page">Not logged in</div>
        </div>
      </Layout>
    )
  }

  const errors = getErrorArrayFromTrpcResponseError(error, isError)

  return (
    <Layout privateRoute>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

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
                  const user = UserSchema.parse(body)

                  updateUser(user)
                }}
              >
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      name={'image'}
                      placeholder="URL of profile picture"
                      disabled={isLoading}
                      defaultValue={user.image ?? ''}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Your Name"
                      name={'username'}
                      disabled={isLoading}
                      defaultValue={user.username}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      rows={8}
                      placeholder="Short bio about you"
                      name={'bio'}
                      disabled={isLoading}
                      defaultValue={user.bio ?? ''}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      name={'email'}
                      disabled={isLoading}
                      defaultValue={user.email}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      name={'password'}
                      disabled={isLoading}
                      placeholder="New Password"
                    />
                  </fieldset>
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type={'submit'}
                    disabled={isLoading}
                  >
                    Update Settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button
                className="btn btn-outline-danger"
                type={'button'}
                disabled={isLoading}
                onClick={() => {
                  setToken(null)

                  // Hard reset all user data on the page
                  ctx.auth.me.reset().catch(console.error)

                  push('/').catch(console.error)
                }}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login
