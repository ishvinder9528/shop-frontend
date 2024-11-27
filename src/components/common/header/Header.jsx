import { useState, useContext } from "react";
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

import { UserContext } from '../../../context/userContext'
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate()
  const [openDailog, setOpenDailog] = useState(false);
  const { user, setUser } = useContext(UserContext)
  const login = useGoogleLogin({
    onSuccess: (credResponse) => {
      console.log(credResponse);
      getUserProfile(credResponse);
      setOpenDailog(false)
    },
    onError: (error) => {
      console.log("Login Failed: ", error);
      alert('Google Login Failed. Please try again.');
    },
  });

  const getUserProfile = async (token) => {
    await axios.get(` https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=` + token.access_token, {
      headers: {
        'Authorization': 'Bearer ' + token.access_token, 'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log("response: " + JSON.stringify(response));
      localStorage.setItem("user", JSON.stringify(response.data))
      setOpenDailog(false);
      setUser(JSON.parse(localStorage.getItem('user')))
    })
  }

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <div>
        <img src="/logo.svg" alt="icon logo" />
      </div>

      <div>
        {user ? (
          <>
            {/* Buttons for large screens */}
            <div className='hidden sm:flex gap-5 items-center'>
              <Button
                onClick={() => navigate('/create-trip')}
                className='rounded-full'
                variant='outline'
              >
                + Create Trip
              </Button>

              <Button
                onClick={() => navigate('/my-trips')}
                className='rounded-full'
                variant='outline'
              >
                My Trips
              </Button>

              <Popover>
                <PopoverTrigger>
                  <img src={user.picture} className='h-[35px] w-[35px] rounded-full' />
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
                <DropdownMenuTrigger>
                  <Button variant='outline' className='rounded-full'>
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/create-trip')}>
                    + Create Trip
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-trips')}>
                    My Trips
                  </DropdownMenuItem>
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
          <Button onClick={() => setOpenDailog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7 flex justify-start">
                Sign In with Google
              </h2>
              <p className="flex justify-start">
                Sign in to the App with Google authentication securely
              </p>

              <Button
                className="w-full mt-5 flex gap-4 items-center"
                onClick={login}
              >
                <>
                  <FcGoogle style={{ width: "28px", height: "28px" }} />
                  Sign In with Google
                </>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
