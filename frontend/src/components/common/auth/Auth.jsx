import { Button } from "@/components/ui/button";
import Login from "./Login"
import Register from "./Register"
import { useState } from "react";
const Auth = () => {

    const [isLogin, setIsLogin] = useState(true)
    const handleToggle = () => {
        setIsLogin(!isLogin)
    }
    return (
        <div>
            {isLogin ? <Login /> : <Register />}
        </div>
    )
}

export default Auth;