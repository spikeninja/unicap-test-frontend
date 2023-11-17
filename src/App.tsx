import axios from 'axios';

import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import { useAuthStore } from "./store/main";
import ProtectedRoutes from "./hooks/protected";
import { API_URL } from "./api/assistant";
import Header from './components/Header/Header';

function App() {
  const navigate = useNavigate()
  const {login, logout, isLoggedIn} = useAuthStore(state => state)

  useEffect(() => {
    const token = localStorage.getItem("@token")
    if(token !== null){
      axios.get(API_URL + '/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        login(token, res.data)
        navigate('/')
      }).catch(err => {
        logout()
        navigate('/auth')
      })
    }
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
          <Route index element={<MainPage />}/>
        </Route>
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
