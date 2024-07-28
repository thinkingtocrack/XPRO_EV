import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider} from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import HomeComponent from './components/home/Index.tsx'
import { Provider } from 'react-redux'
import store, { persistor } from './store/configurestore.ts'
import { PersistGate } from 'redux-persist/integration/react'

const router=createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/"  element={<Home  /> } >
        <Route index element={<HomeComponent/>} />
        <Route path="/login" element={<Login  />}/>
        <Route path="/signup" element={<Signup/>}/>
      </Route>
    </>    
  )
)

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
