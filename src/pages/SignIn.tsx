import React from 'react';

function SignIn(){
  return(
    <div className="users-page-bg">
      <form className="users-form">
        <input className="users-input" type="email" placeholder="Email"/>
        <input className="users-input" type="password" placeholder="Passowrd"/>
        <button className="users-button">Sign In</button>
      </form>
    </div>
  )
}