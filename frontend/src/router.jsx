import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/common/header/Layout";
import Home from "./components/common/Home";
import CreateShop from "./components/create-shop";
import Login from "./components/common/auth/Login";
import Register from "./components/common/auth/Register";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'create-shop',
                element: <CreateShop />,
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ],
    },
]);

export default Router;
