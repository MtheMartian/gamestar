import React from "react";

export default function Header({item}){
  return(
    <header id="main-header">
      <div id="left-side">
        <div id="logo">
          <p><a href="/">Logo</a></p>
        </div>
        {item}
      </div>
    </header>
  );
}