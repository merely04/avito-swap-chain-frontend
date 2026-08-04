import { createBrowserRouter } from 'react-router-dom'
import { CreateOfferPage } from '@/pages/create-offer'
import { DashboardPage } from '@/pages/dashboard'
import { ExchangePage } from '@/pages/exchange'

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/items/new', element: <CreateOfferPage /> },
  { path: '/exchange/:id', element: <ExchangePage /> },
])
