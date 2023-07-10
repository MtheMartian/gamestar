import React from "react";

type HeaderProps = {
  item: JSX.Element | JSX.Element[],
}

export default function Header({item}: HeaderProps ){
  return(
    <header id="main-header">
      <div id="left-side">
        <div id="logo">
          <a href="/">
            <img id="logo" src="/main/images/logo.webp" alt="Logo" />
          </a>
        </div>
        {item}
      </div>
    </header>
  );
}

