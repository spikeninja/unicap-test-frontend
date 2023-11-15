import { useState } from "react";

import axios from "axios";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/main";
import { API_URL } from "../api/assistant";

const AuthPage = () => {
  const navigate = useNavigate()
  const { token, setLogin, isLoggedIn } = useAuthStore(state => state)

  const [error, setError] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isLogin, setIsLogin] = useState<boolean>(false)

  const handleSubmit = (values: {email: string, password: string}) => {
    setError(null)
    setIsLoading(true)

    const payload = {
      email: values.email,
      password: values.password,
    }

    const action = isLogin ? 'login' : 'register'

    axios.post(API_URL + `/api/users/${action}`, payload)
      .then(res => {
        const { access_token: token, user } = res.data

        setLogin(token, user) 
        localStorage.setItem('@token', token)

        console.log("isLoggedIn: ", isLoggedIn)
        console.log("Res: ", res)

        navigate('/')
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.response.data)
        setIsLoading(false)
      })
  }

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'} to proceed</h2>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 15,
            }}>
              <input
                style={{
                  width: 300,
                  height: 30,
                  fontSize: 18,
                  textAlign: "center",
                }}
                type="email"
                placeholder="Your email"
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                required
              />
              <input
                style={{
                  width: 300,
                  height: 30,
                  fontSize: 18,
                  textAlign: "center",
                }}
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                required
              />
              <button
                // @ts-ignore
                onClick={formik.handleSubmit}
                disabled={isLoading}
                style={{
                  fontSize: 18,
                  maxWidth: 300,
                }}
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </div>
          </>
        )}
      </Formik>
      {error && <p style={{ color: 'red'}}>Error: {JSON.stringify(error)}</p>}
      <a
        style={{
          display: 'block',
          cursor: 'pointer',
          marginTop: 15,
        }}
        onClick={() => {
          setIsLogin(prev => !prev)
        }}
      >{isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
      </a>
    </div>
  )
}

export default AuthPage;
