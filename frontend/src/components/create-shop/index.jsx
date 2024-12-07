import { useEffect, useState } from "react"
import { GET_SHOPS } from "./services"
import Form from "./components/Form"
import ShopTable from "./components/Table";
import { TbLoaderQuarter } from "react-icons/tb";
import { Input } from "@/components/ui/input";

const CreateShop = () => {
    const [shops, setShops] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const response = await GET_SHOPS();
            if (Array.isArray(response)) {
                setShops(response);
            } else {
                console.error("Expected an array but got:", response);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.gst?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="my-6 mx-3 md:mx-[65px] grid grid-cols-1 lg:grid-cols-2 gap-5 ">
            {/* left */}
            <div className="">
                <h2 className="font-bold text-2xl pb-2">Add Shop +</h2>

                <hr className="mt-2" />

                <Form />
            </div>

            <div className="">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl pb-2">Shops</h2>

                    <div className="pr-2">
                        <Input
                            type="search"
                            placeholder="Search Shop"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[200px] "
                        />
                    </div>
                </div>

                <hr className="mt-2" />

                <div>
                    {loading ? (
                        <div className="flex text-center items-center mt-[200px]">
                            <TbLoaderQuarter className="h-10 w-full animate-spin" />
                        </div>
                    ) : filteredShops.length === 0 ? (
                        <div className="flex text-center items-center justify-center my-[100px]">
                            <p>No Shops Found</p>
                        </div>
                    ) : (
                        <ShopTable shops={filteredShops} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateShop