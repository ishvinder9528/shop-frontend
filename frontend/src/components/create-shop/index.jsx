import { useEffect, useState } from "react"

import { GET_SHOPS } from "./services"
import Form from "./components/Form"
import ShopTable from "./components/Table";
import { TbLoaderQuarter } from "react-icons/tb";

const CreateShop = () => {
    const [shops, setShops] = useState([])

    useEffect(() => {
        fetchShops();
    }, []);


    const [loading, setLoading] = useState(true);

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



    return (
        <div className="my-6 mx-3 md:mx-[65px] grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* shpop form */}
            <Form />

            {/* shop data */}
            <div className="">
                <div className="flex justify-between items-center">
                    
                </div>
                <h2 className="font-bold text-2xl pb-2 shadow-sm">Shops</h2>

                <div>

                    {loading ?
                        <div className="flex text-center items-center mt-[200px]">
                            <TbLoaderQuarter className="h-10 w-full animate-spin" />
                        </div> :
                        shops.length == 0 ?
                            <div className="flex text-center items-center 
                        justify-center
                        my-[100px] ">
                                <p>No Shops Available</p>
                            </div>
                            :
                            <ShopTable shops={shops} />
                    }

                </div>
            </div>
        </div>
    )
}

export default CreateShop