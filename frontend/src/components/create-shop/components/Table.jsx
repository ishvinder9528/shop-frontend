import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { IoInformationCircleSharp } from "react-icons/io5";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const ShopTable = ({ shops }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate total pages
    const totalPages = Math.ceil(shops.length / itemsPerPage);

    // Paginated shops
    const paginatedShops = shops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {

    }, [currentPage, paginatedShops]);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>Your All Shops.</TableCaption>
                <TableHeader>
                    <TableRow className=''>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>GST</TableHead>
                        <TableHead className="w-[100px]">About</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedShops.map((shop, index) => (
                        <TableRow className="hover:cursor-pointer  hover:bg-gray-200" key={index}>
                            <TableCell className="font-medium">{shop.name}</TableCell>
                            <TableCell>{shop.location ? shop.location : <span className="text-gray-400">
                                No location information.
                            </span>
                            }</TableCell>
                            <TableCell>{shop.phone ? shop.phone : <span className="text-gray-400">
                                No phone number.
                            </span>}</TableCell>
                            <TableCell>{shop.gst ? shop.gst : <span className="text-gray-400">
                                No GST number.
                            </span>}</TableCell>
                            <TableCell className="flex justify-center items-center relative">
                                <HoverCard open={openIndex === index}>
                                    <HoverCardTrigger onClick={() => handleToggle(index)}>
                                        <IoInformationCircleSharp className="h-10 w-5 hover:scale-75" />
                                    </HoverCardTrigger>
                                    <HoverCardContent side="top" align="center" className="z-[9999]">
                                        {shop.about ? shop.about : <span className="text-gray-400">
                                            No information about this shop.
                                        </span>}
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Section */}
            <div className="flex justify-between w-full mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(currentPage - 1);
                                }}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    className={
                                        currentPage === i + 1 ? "font-bold text-blue-500" : ""
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(i + 1);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(currentPage + 1);
                                }}
                                disabled={currentPage == + totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default ShopTable;
