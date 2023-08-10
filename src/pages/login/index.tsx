import { api, setToken, useIsLoggedIn } from '$/lib/api'
import { type NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Login: NextPage = () => {
  const { push } = useRouter()
  const isLoggedIn = useIsLoggedIn()

  useEffect(() => {
    if (isLoggedIn) {
      push('/')
        .catch(console.error)
    }
  }, [push])

  const { mutate: login, isSuccess, isLoading, data: loginData, error, isError } = api.auth.login.useMutation()

  useEffect(() => {
    if (!isSuccess || !loginData) {
      return
    }
    setToken(loginData.user.token)
    // This is used, so that the token is already set when the page is loaded
    setTimeout(() => {
      push('/')
        .catch(console.error)
    }, 0)
  }, [isSuccess, loginData, push])

  const errors = !isError
                 ? undefined
                 : error?.data?.zodError?.fieldErrors
                   ? Object.entries(error?.data?.zodError?.fieldErrors)
                     .flatMap(([key, value]) => value?.map(v => `${ key }: ${ v }`))
                   : [error?.message ?? 'Unknown error']

  return <div className='auth-page'>
    <div className='container page'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          <h1 className='text-xs-center'>Sign in</h1>
          <p className='text-xs-center'>
            <Link href='/register'>Need an account?</Link>
          </p>

          <ul className='error-messages'>
            {
              errors?.map((error, i) => <li key={ i }>{ error }</li>)
            }
          </ul>

          <form
            onSubmit={ (e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const data = new FormData(form)
              const body = Object.fromEntries(data.entries())
              if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                return
              }
              const user = body as { email: string, password: string }
              login({ user })
            } }
          >
            <fieldset className='form-group'>
              <input
                className='form-control form-control-lg'
                type='text'
                name='email'
                placeholder='Email'
                disabled={ isLoading }
              />
            </fieldset>
            <fieldset className='form-group'>
              <input
                className='form-control form-control-lg'
                type='password'
                name='password'
                placeholder='Password'
                disabled={ isLoading }
              />
            </fieldset>
            <button className='btn btn-lg btn-primary pull-xs-right'>Sign in</button>
          </form>
        </div>
      </div>
    </div>
  </div>
}

export default Login
