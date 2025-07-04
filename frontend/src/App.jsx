import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {Toaster} from "react-hot-toast"

import {HomePage} from './page/HomePage'
import LoginPage  from './page/LoginPage'
import SignUpPage  from './page/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'

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
    <div className='flex flex-col items-center justify-center'>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Layout/>}>

        <Route 
        index
        path='/home'
        element={authUser ? <HomePage/> : <Navigate to={"/login"}/>}
        />
        </Route>


        <Route 
        path = '/login'
        element={!authUser ? <LoginPage/>: <Navigate to={"/"}/>}
         />

         <Route
         path='/signup'
         element={!authUser ? <SignUpPage/>: <Navigate to={'/'}/>}
         />
          

      </Routes>
    </div>
    </>
  )
}

export default App
