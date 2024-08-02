import {RouterProvider} from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './store/configurestore.ts'
import { PersistGate } from 'redux-persist/integration/react'
import router from "./routes/route.tsx"


function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>  
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
