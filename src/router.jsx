import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/common/header/Layout";
import Home from "./components/common/Home";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: 'about',
                element: <div>About Component</div>,
            },
        ],
    },
]);

export default Router;
