import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

const Header = () => {
  const [openDailog, setOpenDailog] = useState(false);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
    },
    flow: "auth-code",
    onError: (error) => {
      console.log("Login Failed: ", error);
      alert('Google Login Failed. Please try again.');
    },
  });

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <div>
        <img src="/logo.svg" alt="icon logo" />
      </div>
      <div>
        <Button onClick={() => setOpenDailog(true)}>Sign In</Button>
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
