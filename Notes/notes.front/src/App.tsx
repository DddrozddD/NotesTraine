import { useState } from 'react'
import { type FC, type ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import userManager, {
  loadUser,
  signinRedirect,
  signoutRedirect
} from './auth/user-service';
import './App.css'
import AuthProvider from './auth/auth-provider';
import SigninOidc from './auth/SigninOidc';
import SignoutOidc from './auth/SignoutOidc';
import NoteList from './notes/NoteList';
const App:FC<{}> = (): ReactElement => {
  const [count, setCount] = useState(0)
  loadUser();
  return (
    <>
      <div className='App'>
       <header className='App-header'>
        <button onClick={() => signinRedirect()}>Login</button>
        <AuthProvider userManager={userManager}>
          <Router>
            <Routes>
              <Route path='/' element={<NoteList />} />
              <Route path='/signout-oidc' element={<SignoutOidc />} />
              <Route path='/signin-oidc' element={<SigninOidc />} />
            </Routes>
          </Router>
        </AuthProvider>
       </header>
      </div>
    </>
  )
}

export default App
