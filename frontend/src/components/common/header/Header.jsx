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
import { FaRegUser } from "react-icons/fa6";
import { RiShoppingBagLine } from "react-icons/ri";
import { RiBookletLine } from "react-icons/ri";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

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
              onClick={() => navigate('/create-shop')}
            >
              <RiShoppingBagLine /> Shops
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/ledger')}
            >
              <RiBookletLine /> Ledger
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/khata')}
            >
              <MdOutlineAccountBalanceWallet /> Khata
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
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
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[100px]">
                  <DropdownMenuItem onClick={() => navigate('/profile')}><FaRegUser /> Profile</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      setUser(null);
                      navigate('/');
                    }}
                  >
                    <LuLogOut /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <DropdownMenuContent align="end" className="w-[150px]">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <span className="flex items-center gap-2">
                    <FaRegUser /> Profile
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex flex-col">
                      <span className="text-gray-500 text-sm mb-1">Apps</span>
                      <div className="flex flex-col space-y-1 ml-4">
                        <span
                          className="cursor-pointer flex items-center gap-2"
                          onClick={() => navigate('/create-shop')}
                        >
                          <RiShoppingBagLine />  Shops
                        </span>
                        <span
                          className="cursor-pointer flex items-center gap-2"
                          onClick={() => navigate('/ledger')}
                        >
                          <RiBookletLine /> Ledger
                        </span>
                        <span
                          className="cursor-pointer flex items-center gap-2"
                          onClick={() => navigate('/khata')}
                        >
                         <MdOutlineAccountBalanceWallet /> Khata
                        </span>
                      </div>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      setUser(null);
                      navigate('/');
                    }}
                  >
                    <span className="flex items-center gap-2">
                    <LuLogOut /> Logout
                    </span>
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
