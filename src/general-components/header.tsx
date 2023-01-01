import React from "react";

type HeaderProps = {
  item: JSX.Element | JSX.Element[],
}

export default function Header({item}: HeaderProps ){
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

