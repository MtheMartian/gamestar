import React from 'react';
import {useRef} from 'react';

function SignIn(){
  const emailInput= useRef<HTMLInputElement | null>(null);
  const passwordInput= useRef<HTMLInputElement | null>(null);

  return(
    <div className="users-page-bg">
      <form className="users-form">
        <input className="users-input" type="email" placeholder="Email" ref={emailInput}/>
        <input className="users-input" type="password" placeholder="Passowrd" ref={passwordInput}/>
        <button className="users-button">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;