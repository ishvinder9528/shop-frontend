import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/common/header/Layout";
import Home from "./components/common/Home";
import CreateShop from "./components/create-shop";

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
                path: 'create-shop',
                element:<CreateShop/>,
            },
        ],
    },
]);

export default Router;
