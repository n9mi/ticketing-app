import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/shadcn/ui/pagination"
import { PaginationLinkItem } from "@/types";

const TablePagination = ({ links } : { links: PaginationLinkItem[] }) => {
    return (
        <Pagination className="">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                {
                    links.map((l, i) => (
                        <PaginationItem key={ i }>
                            {
                                <PaginationLink
                                    href={ l.link }
                                    isActive={ l.isActive }>
                                        { i + 1 }
                                </PaginationLink>
                            }
                        </PaginationItem>
                    ))
                }
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default TablePagination
