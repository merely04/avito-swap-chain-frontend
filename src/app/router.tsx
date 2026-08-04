import { createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '@/pages/dashboard'
import { ExchangePage } from '@/pages/exchange'

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/exchange/:id', element: <ExchangePage /> },
])
