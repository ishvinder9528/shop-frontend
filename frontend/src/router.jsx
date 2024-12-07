import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/common/header/Layout";
import Home from "./components/common/Home";
import CreateShop from "./components/create-shop";
import Login from "./components/common/auth/Login";
import Register from "./components/common/auth/Register";
import Ledger from "./components/ledger/Ledger";
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
            },
            {
                path: 'ledger',
                element: <Ledger />
            }
        ],
    },
]);

export default Router;
