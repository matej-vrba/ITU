import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Project from './Project';
import ProjectDetail, {loader as projectDetailLoader } from './ProjectDetail';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "/project/",
        element: <Project/>,
        children:[
          {
            path: "/project/:snippetId",
            element: <ProjectDetail/>,
            loader: projectDetailLoader,
          }
        ],
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
);
