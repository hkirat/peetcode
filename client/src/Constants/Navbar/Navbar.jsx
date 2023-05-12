import React from 'react'
import { Link } from 'react-router-dom'

// import './Navbar.css'

// old navbar
const Navbar1 = () => {
  return (
    <div id='navbar-main' className='flex-row'>
      <Link to={'/'}>
        <div className="logo-box flex-row">
          <img className='logo' src="https://user-images.githubusercontent.com/63964149/152531278-5e01909d-0c2e-412a-8acc-4a06863c244d.png" alt="logo" />
          <p>NeetCode</p>
        </div>
      </Link>
      <div className="nav-options">
        <Link to={'/problemset/all/'} >Problems</Link>
      </div>
      <div className="nav-options">
        <Link to={'/signup'} >Signup</Link>
      </div>
      <div className="nav-options">
        <Link to={'/login'} >Login</Link>
      </div>
    </div>
  )
}

// new nav bar
const Navbar = () => {
  return (

    <div className="bg-neutral-700 flex md:p-4 p-3 md:text-xl text-sm
          shadow-lg
          text-stone-300
          
      ">

      <div className="items-center w-full flex">
        <Link to={'/'}>
          <div className="text-white cursor-pointer md:text-3xl text-md md:pr-4
                  flex items-center
              ">
            <div className="md:px-2 pr-1"><img src="https://user-images.githubusercontent.com/63964149/152531278-5e01909d-0c2e-412a-8acc-4a06863c244d.png" className="md:w-10 w-5"></img></div>
            <div>
              PeetCode
            </div>
          </div>
        </Link>
        <div className="md:px-4 pl-3 hover:text-white cursor-pointer h-full items-center flex" > <Link to={'/problemset/all/'} >Problems</Link></div>

       
      </div>

      <div className="items-center
           hover:text-white 
           cursor-pointer md:px-4 px-1 flex">
        <Link to={'/signup'} >Signup</Link>
      </div>
      <div className="items-center
           hover:text-white 
           cursor-pointer md:px-4 px-1 flex">
        <Link to={'/login'} >Login</Link>
      </div>

    </div>

  )
}

export default Navbar