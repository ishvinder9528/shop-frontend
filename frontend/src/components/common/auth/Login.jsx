import { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateUser,loginUser } from '@/services/userService';
import { UserContext } from '../../../context/userContext';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login submitted', { email, password });
        loginUser({ email, password });
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (credResponse) => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${credResponse.access_token}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${credResponse.access_token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                    
                    
                );

                const googleData = response.data;
                const userData = {
                    name: googleData.name,
                    email: googleData.email,
                    picture: googleData.picture,
                    googleId: googleData.id,
                    given_name: googleData.given_name,
                    family_name: googleData.family_name,
                    verified_email: googleData.verified_email,
                    token: credResponse.access_token
                };

                const user = await createOrUpdateUser(userData);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                navigate('/');
            } catch (error) {
                console.error("Error in Google login:", error);
                alert('Failed to login with Google. Please try again.');
            }
        },
        onError: (error) => {
            console.log("Google Login Failed:", error);
            alert('Google Login Failed. Please try again.');
        },
        flow: 'implicit',
        ux_mode: 'redirect',
        redirect_uri: window.location.origin + '/login',
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="md:w-[550px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Welcome back</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    placeholder="Enter your email" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    placeholder="Enter your password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full" type="submit" onClick={handleSubmit}>
                        Login
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => googleLogin()}>
                        <FcGoogle className="mr-2 h-4 w-4" />
                        Login with Google
                    </Button>
                    <p className="text-sm text-center">
                        Don't have an account?{' '}
                        <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;