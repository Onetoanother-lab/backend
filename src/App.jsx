import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from './store/slices/authSlice'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PostNewsPage from './pages/PostNewsPage'
import ManagePostsPage from './pages/ManagePostsPage'
import ApiExplorerPage from './pages/ApiExplorerPage'
import {
  BannerPage, GenderPage, HonoraryPage, IndustryNewsPage,
  LeaderPage, LocalNewsPage, NewsPage, NormativePage,
  BolimlarPage, VacanciesPage, XotinQizlarPage, YoshlarPage, PlansReportsPage
} from './pages/ResourcePages'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index                   element={<DashboardPage />} />
        <Route path="post-news"        element={<PostNewsPage />} />
        <Route path="manage-posts"     element={<ManagePostsPage />} />
        <Route path="api-explorer"     element={<ApiExplorerPage />} />

        {/* Content */}
        <Route path="news"             element={<NewsPage />} />
        <Route path="localnews"        element={<LocalNewsPage />} />
        <Route path="industry-news"    element={<IndustryNewsPage />} />
        <Route path="banners"          element={<BannerPage />} />

        {/* Organisation */}
        <Route path="leaders"          element={<LeaderPage />} />
        <Route path="honorary"         element={<HonoraryPage />} />
        <Route path="bolimlar"         element={<BolimlarPage />} />
        <Route path="vacancies"        element={<VacanciesPage />} />

        {/* Policies */}
        <Route path="gender"           element={<GenderPage />} />
        <Route path="xotin-qizlar"     element={<XotinQizlarPage />} />
        <Route path="yoshlar"          element={<YoshlarPage />} />

        {/* Documents */}
        <Route path="normative"        element={<NormativePage />} />
        <Route path="plans-reports"    element={<PlansReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
