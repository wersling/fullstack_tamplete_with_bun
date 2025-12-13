import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { I18nProvider } from '@/hooks/useI18n'

function App() {
    return (
        <I18nProvider>
            <RouterProvider router={router} />
        </I18nProvider>
    )
}

export default App
