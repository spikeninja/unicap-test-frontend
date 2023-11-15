import { Outlet, Navigate } from "react-router-dom"


const ProtectedRoutes = ({isLoggedIn}: {isLoggedIn: boolean}) => {
  return <div>{isLoggedIn ? <Outlet /> : <Navigate to='/auth' />}</div>
}


export default ProtectedRoutes;