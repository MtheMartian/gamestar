import React from "react";
import logo from "../images/logo.webp";

type HeaderProps = {
  item: JSX.Element | JSX.Element[],
}

export default function Header({item}: HeaderProps ){
  return(
    <header id="main-header">
      <div id="left-side">
        <div id="logo">
          <a href="/">
            <img id="logo" src={logo} alt="Logo" />
          </a>
        </div>
        {item}
      </div>
    </header>
  );
}

