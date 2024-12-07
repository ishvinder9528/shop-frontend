import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_SHOP } from "../services";

const Form = () => {
  const [shopFormVisibile, setShopFormVisibile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    gst: "",
    phone: "",
    about: ""
  });
  const [loading, setLoading] = useState(false);

  const handleResize = () => {
    const isLargeScreen = window.innerWidth >= 1024;
    setShopFormVisibile((prevVisible) => (isLargeScreen ? true : prevVisible));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await CREATE_SHOP(formData);
      // Reset form
      setFormData({
        name: "",
        location: "",
        gst: "",
        phone: "",
        about: ""
      });
      // Optionally refresh the shop list
      window.location.reload();
    } catch (error) {
      console.error("Error creating shop:", error);
    } finally {
      setLoading(false);
    }
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
        <div className="flex flex-col gap-5 mt-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Shop Name</h3>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Shop Name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Location</h3>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter Location"

              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">GST Number</h3>
              <Input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                placeholder="Enter GST Number"

              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Phone Number</h3>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="eg. 1234567890"

              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl">About</h3>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Any information about this Shop."

              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Shop"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Form;
