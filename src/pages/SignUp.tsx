import React from 'react';
import {useEffect, useRef} from 'react';
import '../css/signup-page.css';

function Signup(){ 
  const confPasswordinput = useRef<HTMLInputElement | null>(null);
  const emailInput= useRef<HTMLInputElement | null>(null);
  const userNameInput= useRef<HTMLInputElement | null>(null);
  const passwordInput= useRef<HTMLInputElement | null>(null);
  
  async function signUpHandler(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    await fetch("/user/signup", {
      method: "post",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userName: userNameInput.current!.value,
        email: emailInput.current!.value,
        password: passwordInput.current!.value,
        confPassword: confPasswordinput.current!.value,
      })
    })
    .then(response => response.json())
    .then((data: {} | null)=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  return(
    <div id="signup-page-bg">
      <form id="signup-form">
        <input type="email" placeholder='Email' ref={emailInput}/>
        <input type="text" placeholder="Display Name" ref={userNameInput}/>
        <input type="password" placeholder="Password" ref={passwordInput}/>
        <input type="password" placeholder="Confirm Password" ref={confPasswordinput}/>
        <button onClick={signUpHandler}>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;