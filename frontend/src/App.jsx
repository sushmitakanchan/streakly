import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast"

import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
import LandingPage from './page/LandingPage'
import DashboardPage from './page/DashboardPage'
import AdminDashboardPage from './page/AdminDashboardPage'
import ProblemsPage from './page/ProblemsPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import AdminRoute from './components/AdminRoute'
import AddProblem from './page/AddProblem'
import ProblemPage from './page/ProblemPage'
import PlaylistPage from './page/PlaylistPage'
import PlaylistsPage from './page/PlaylistsPage'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col w-full'>
        <Toaster />
        <Routes>
          <Route index element={<LandingPage />} />

          {/* Auth */}
          <Route
            path='/login'
            element={!authUser ? <LoginPage /> : <Navigate to='/dashboard' />}
          />
          <Route
            path='/signup'
            element={!authUser ? <SignUpPage /> : <Navigate to='/dashboard' />}
          />

          {/* Dashboard — role-aware, no Layout wrapper */}
          <Route
            path='/dashboard'
            element={
              authUser
                ? (authUser.role === 'ADMIN' ? <AdminDashboardPage /> : <DashboardPage />)
                : <Navigate to='/' />
            }
          />

          {/* Problems list — no Layout wrapper */}
          <Route
            path='/problems'
            element={authUser ? <ProblemsPage /> : <Navigate to='/login' />}
          />

          {/* Problem page — no Layout wrapper (has its own nav) */}
          <Route
            path='/problem/:id'
            element={authUser ? <ProblemPage /> : <Navigate to='/login' />}
          />

          {/* All playlists */}
          <Route
            path='/playlists'
            element={authUser ? <PlaylistsPage /> : <Navigate to='/login' />}
          />

          {/* Playlist detail page */}
          <Route
            path='/playlist/:playlistId'
            element={authUser ? <PlaylistPage /> : <Navigate to='/login' />}
          />

          {/* Admin add-problem — no Layout wrapper (CreateProblemForm has its own shell) */}
          <Route element={<AdminRoute />}>
            <Route
              path='/add-problem'
              element={authUser ? <AddProblem /> : <Navigate to='/' />}
            />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
