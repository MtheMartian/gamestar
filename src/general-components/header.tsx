import React from "react";

export default function Header<HTMLElement>(item : HTMLElement){
  return(
    <header id="main-header">
      <div id="left-side">
        <div id="logo">
          <p><a href="/">Logo</a></p>
        </div>
        {!!item}
      </div>
    </header>
  );
}