import { createBrowserRouter } from 'react-router-dom'
import { CreateOfferPage } from '@/pages/create-offer'
import { DashboardPage } from '@/pages/dashboard'
import { EnableBarterPage } from '@/pages/enable-barter'
import { ExchangePage } from '@/pages/exchange'
import { AvitoShell } from '@/widgets/avito-shell'

export const router = createBrowserRouter([
  {
    // Layout-роут: все экраны раздела живут внутри оболочки Авито.
    element: <AvitoShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/items/new', element: <CreateOfferPage /> },
      { path: '/items/:id/barter', element: <EnableBarterPage /> },
      { path: '/exchange/:id', element: <ExchangePage /> },
    ],
  },
])
