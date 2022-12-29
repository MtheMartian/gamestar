import React from 'react';
import ReactDOM from 'react-dom/client';
import Search from './pages/Search';
// import Root from './routes/root';
import NoPage from './pages/NoPage';
import HomePage from './pages/Home';
import Info from './pages/TitleInfo';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  // Route,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NoPage />
  },
  {
    path:"/search",
    element: <Search />,
    errorElement: <NoPage />
  },
  {
    path: "/info",
    element: <Info />,
    errorElement: <NoPage />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
