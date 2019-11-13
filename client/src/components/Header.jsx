import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(props) {
  return (
    <nav>
      <Link to='/' id='home'>Gamium</Link>
      {
        props.currentUser ?
          <div id='header'>
            <p>Hello, {props.currentUser.username}</p>
            <Link to='/games/new' id='add'>
              <a>Add Game</a>
            </Link>
            <a onClick={props.handleLogout} id='logout'>Logout</a>
          </div>
          :
          <Link to='/login' id='login-nav'><a>Login/Register</a></Link>
      }
    </nav>
  )
}
