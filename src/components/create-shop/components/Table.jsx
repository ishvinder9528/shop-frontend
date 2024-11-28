/* eslint-disable react/prop-types */
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

const ShopTable = ({ shops }) => {

    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        console.log("shops:", shops);
    }, []);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
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
                                <HoverCard open={openIndex === index}>
                                    <HoverCardTrigger onClick={() => handleToggle(index)}>
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
            </Table></div>
    )
}

export default ShopTable