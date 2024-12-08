import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateUser } from '@/services/userService';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here
        console.log('Registration submitted', { name, email, password });
    };

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

                const userData = {
                    ...response.data,
                    googleId: response.data.id
                };

                await createOrUpdateUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                navigate('/');
            } catch (error) {
                console.error("Error in Google registration:", error);
                alert('Failed to register with Google. Please try again.');
            }
        },
        onError: (error) => {
            console.log("Google Registration Failed:", error);
            alert('Google Registration Failed. Please try again.');
        },
        flow: 'implicit',
        ux_mode: 'redirect',
        redirect_uri: window.location.origin + '/login',
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="md:w-[550px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Enter your name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
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
                                    placeholder="Create a password" 
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
                        Register
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => googleLogin()}>
                        <FcGoogle className="mr-2 h-4 w-4" />
                        Register with Google
                    </Button>
                    <p className="text-sm text-center">
                        Already have an account?{' '}
                        <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;