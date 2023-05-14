import React, { useEffect , useState } from 'react'
import { Link } from 'react-router-dom'

import './Navbar.css'

const Navbar = () => {
  const [Token, setToken] = useState(undefined); 
  useEffect( () => {
    const getToken = localStorage.token;
    if (getToken !== undefined){
      setToken(getToken) ;
    }
  }, [])

  const clearLocalStorage = () => {
    localStorage.clear() ;
    setToken(undefined) ;
  }  
  return (
    <div id='navbar-main' className='flex-row'>
      <a href={'/'}>
        <div className="logo-box flex-row"> 
          <img className='logo' src="https://user-images.githubusercontent.com/63964149/152531278-5e01909d-0c2e-412a-8acc-4a06863c244d.png" alt="logo" /> 
          <p>PeetCode</p>
        </div>
      </a>
      <div className="nav-options">
        <Link to={'/problemset/all/'} >Problems</Link>
      </div>

      { (Token === undefined)? (
        <>
        <div className="nav-options">
          <Link to={'/signup'} >Signup</Link>
        </div>
        <div className="nav-options">
          <Link to={'/login'} >Login</Link>
        </div>
        </>
      ) :
      (
        <div className="nav-options">
          <Link onClick={clearLocalStorage} to={'/signup'} >Logout</Link>
        </div>
      )}

    </div>
  )
}

export default Navbar
