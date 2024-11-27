import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { IoInformationCircleSharp } from "react-icons/io5";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { GET_SHOPS } from "./services"

const CreateShop = () => {
    const [shops, setShops] = useState([{
        name: 'GuruKirpa Collection',
        location: 'Noorpur',
        gst: 'AAN39830ONK0832',
        phone: '983783474',
        about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in dicta accusamus maiores dolore dignissimos consequuntur ad, ipsa reiciendis vero earum illo esse distinctio neque, culpa dolores repellat aspernatur eaque'
    }])

    useEffect(() => {      
        fetchShops();
    }, []);
    
    const fetchShops = async () => {
        try {
            const response = await GET_SHOPS();  // Assuming this returns an array
            console.log('shops:', response);
            if (Array.isArray(response)) {
                setShops(response);  // Only set if it's an array
            } else {
                console.error("Expected an array but got:", response);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };
    

    return (
        <div className="my-6 mx-[65px] grid grid-cols-2 gap-5">
            {/* shpop form */}
            <div className="">
                <h2 className="font-bold text-2xl pb-2 shadow-sm">Add Shop +</h2>

                <div className="my-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl">Shop Name</h3>
                        <Input type='text'
                            placeholder='Enter Shop Name' />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl">Location</h3>
                        <Input type='text' placeholder='Enter Shop Location' />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl">GST Number</h3>
                        <Input type='text' placeholder='Enter GST Number' />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl">Phone Number</h3>
                        <Input type='number' placeholder='eg. 1234567890' />
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

            {/* shop data */}
            <div className="border">
                <h2 className="font-bold text-2xl pb-2 shadow-sm">Shops</h2>

                <div>
                    <Table>
                        <TableCaption>Your All Shops.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>GST</TableHead>
                                <TableHead className="w-[100px]">About</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shops.map((shop, index) => (
                                <TableRow className='hover:cursor-pointer' key={index}>
                                    <TableCell className="font-medium">{shop.name}</TableCell>
                                    <TableCell>{shop.location}</TableCell>
                                    <TableCell>{shop.phone}</TableCell>
                                    <TableCell>{shop.gst}</TableCell>
                                    <TableCell className="flex justify-center items-center">
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <IoInformationCircleSharp className="h-10 w-5 hover:scale-75" />
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                {shop.about}
                                            </HoverCardContent>
                                        </HoverCard>
                                    </TableCell>

                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>

                </div>
            </div>
        </div>
    )
}

export default CreateShop