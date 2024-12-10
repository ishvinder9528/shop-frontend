import { useState, useContext, useEffect } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';

import { UserContext } from '../../../context/userContext'
import { useNavigate } from "react-router";
import { createOrUpdateUser } from '../../../services/userService';

const Header = () => {
  const navigate = useNavigate()
  const [openDailog, setOpenDailog] = useState(false);
  const { user, setUser } = useContext(UserContext)
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (credResponse) => {
      getUserProfile(credResponse);
      setOpenDailog(false)
    },
    onError: (error) => {
      console.log("Login Failed: ", error);
      alert('Google Login Failed. Please try again.');
    },
  });

  const getUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token.access_token}`,
        {
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const userData = {
        ...response.data,
        googleId: response.data.id
      };

      // Create or update user in our database
      await createOrUpdateUser(userData);
      
      localStorage.setItem("user", JSON.stringify(userData));
      setOpenDailog(false);
      setUser(userData);
    } catch (error) {
      console.error("Error in user profile:", error);
      alert('Failed to get user profile. Please try again.');
    }
  };

  // Get initials from user name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <div className="flex items-center space-x-6">
        <img 
          src="/logo.svg" 
          alt="icon logo" 
          className="hover:cursor-pointer h-[40px] w-auto" 
          onClick={() => navigate('/')}
        />
        {user && (
          <nav className="hidden md:flex space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
            >
              Shops
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/ledger')}
            >
              Ledger
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/khata')}
            >
              Khata
            </Button>
          </nav>
        )}
      </div>

      <div>
        {user ? (
          <>
            {/* Buttons for large screens */}
            <div className='hidden sm:flex gap-5 items-center'>
              
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <Popover>
                <PopoverTrigger>
                  <Avatar className="h-[35px] w-[35px]">
                    <AvatarImage 
                      src={user?.picture} 
                      alt={user?.name}
                      onError={() => setImageError(true)}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent>
                  <h2
                    className='cursor-pointer'
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      setUser(null);
                      navigate('/');
                    }}
                  >
                    Logout
                  </h2>
                </PopoverContent>
              </Popover>
            </div>

            {/* Dropdown for small screens */}
            <div className='flex sm:hidden items-center'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-[35px] w-[35px]">
                      <AvatarImage 
                        src={user?.picture} 
                        alt={user?.name}
                        onError={() => setImageError(true)}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/')}>Shops</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/ledger')}>Ledger</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/khata')}>Khata</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      setUser(null);
                      navigate('/');
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        )}
      </div>
    </div>
  );
};

export default Header;
