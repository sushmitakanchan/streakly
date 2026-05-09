import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {Toaster} from "react-hot-toast"

import LoginPage  from './page/LoginPage'
import SignUpPage  from './page/SignUpPage'
import LandingA from './revamp/landing-a'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'
import AdminRoute from './components/AdminRoute'
import AddProblem from './page/AddProblem'
import ProblemPage from './page/ProblemPage'

 const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
    <div className='flex flex-col w-full'>
      <Toaster/>
      <Routes>
        <Route
        index
        element={<LandingA/>}
        />

        <Route
        path = '/login'
        element={!authUser ? <LoginPage/>: <Navigate to={"/"}/>}
         />

         <Route
         path='/signup'
         element={!authUser ? <SignUpPage/>: <Navigate to={'/'}/>}
         />

        <Route path='/' element={<Layout/>}>
          <Route
          path='problem/:id'
          element={authUser ? <ProblemPage/> : <Navigate to={"/login"}/>}
          />
          <Route element={<AdminRoute/>}>
          <Route
          path='add-problem'
          element={authUser? <AddProblem/> : <Navigate to="/"/>}
          />
          </Route>
        </Route>

      </Routes>
    </div>
    </>
  )
}

export default App
