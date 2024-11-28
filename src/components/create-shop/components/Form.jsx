import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const Form = () => {
  const [shopFormVisibile, setShopFormVisibile] = useState(false);

  const handleResize = () => {
    const isLargeScreen = window.innerWidth >= 1024;

    setShopFormVisibile((prevVisible) => (isLargeScreen ? true : prevVisible));
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <h2 className="font-bold text-2xl pb-2 shadow-sm">Add Shop +</h2>

      <div className="lg:hidden">
        {!shopFormVisibile && (
          <Button
            className="w-full mt-7"
            onClick={() => setShopFormVisibile(true)}
          >
            Create Shop +
          </Button>
        )}

        {shopFormVisibile && (
          <Button
            className="w-full mt-7"
            onClick={() => setShopFormVisibile(false)}
          >
            Remove Form -
          </Button>
        )}
      </div>

      {shopFormVisibile && (
        <div className="transition-transform">
          <div className="my-5 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Shop Name</h3>
              <Input type="text" placeholder="Enter Shop Name" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Location</h3>
              <Input type="text" placeholder="Enter Shop Location" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">GST Number</h3>
              <Input type="text" placeholder="Enter GST Number" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Phone Number</h3>
              <Input type="number" placeholder="eg. 1234567890" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">About</h3>
              <Textarea placeholder="Any information about this Shop." />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Create Shop</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
