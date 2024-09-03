import MasterLayout from "@/Layouts/MasterLayout";
import { MyTicketsParams, MyTicketsResponse, PageProps } from "@/types";
import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/shadcn/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/shadcn/ui/select";
import { formatDate, toPHPDateString } from "@/utils/date";
import { Input } from "@/shadcn/ui/input"
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/shadcn/ui/button";
import TablePagination from "@/Components/TablePagination";
import { SortTicketBy, TicketPriority, TicketStatus } from "@/enums/ticket";
import { useToast } from "@/shadcn/ui/use-toast";
import { getTicketPriorityDefaultBgColor, getTicketStatusDefaultBgColor } from "@/utils/color";
import { Edit } from "lucide-react";
import DatePicker from "@/Components/DatePicker";
import { SelectSingleEventHandler } from "react-day-picker";
import { Label } from "@/shadcn/ui/label";

const Tickets = ({ response, params } : { response: MyTicketsResponse, params : MyTicketsParams  }) => {
    const getPriorityClassName = (priority : string) => (
        `font-extrabold text-center text-white ${ getTicketPriorityDefaultBgColor(priority) }`
    );
    const getStatusClassName = (status: string) => (
        `font-extrabold text-center text-black ${ getTicketStatusDefaultBgColor(status) }`
    );

    const [ searchSubject, setSearchSubject ] = useState<string>(params.subject);
    const [ searchCategoryId, setSearchCategoryId ] = useState<string>(params.categoryId);
    const [ searchPriority, setSearchPriority ] = useState<string>(params.priority);
    const [ searchStatus, setSearchStatus ] = useState<string>(params.status);
    const [ searchDateFrom, setSearchDateFrom ] = useState<Date | undefined>(
        params.dateFrom !== "" ? new Date(params.dateFrom) : undefined
    );
    const [ searchDateTo, setSearchDateTo ] = useState<Date | undefined>(
        params.dateFrom !== "" ? new Date(params.dateTo) : undefined
    );
    const [ sortBy, setSortBy ] = useState<string>(params.sortBy);
    const [ searchUserName, setSearchUserName ] = useState<string>(params.userName);

    const { toast } = useToast();

    const handleFilter = (
        subject: string = "",
        categoryId: string = "",
        priority: string = "",
        status: string = "",
        dateFrom: string = "",
        dateTo: string = "",
        sortBy: string = SortTicketBy.UPDATED_DATE,
        userName: string = "") => {
        if (dateFrom !== "" && dateTo === "") {
            toast({
                title: "Error!",
                description: "'Search to date' can't be empty!",
                variant: "destructive",
            });
            return;
        }
        if (dateFrom === "" && dateTo !== "") {
            toast({
                title: "Error!",
                description: "'Search from date' can't be empty!",
                variant: "destructive",
            });
            return;
        }
        if (dateFrom > dateTo) {
            toast({
                title: "Error!",
                description: "'Search from date' can't be more than 'Search to date'",
                variant: "destructive",
            });
            return;
        }

        router.get(route("admin.tickets"),
            {
                subject : subject,
                categoryId: categoryId,
                priority: priority,
                status: status,
                dateFrom: dateFrom,
                dateTo: dateTo,
                sortBy: sortBy,
                userName: userName
            },
            { preserveState : true });
    };
    const handleReset = () => {
        setSearchSubject("");
        setSearchCategoryId("");
        setSearchPriority("");
        setSearchStatus("");
        setSearchDateFrom(undefined);
        setSearchDateTo(undefined);
        setSortBy(SortTicketBy.UPDATED_DATE)
        setSearchUserName("");

        handleFilter();
    }

    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success !== null) {
            toast({
                title: "Success!",
                description: flash.success,
                variant: "success",
            });
        }
        if (flash.error !== null) {
            toast({
                title: "Error!",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [ flash ]);

    return (
        <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
            <CardHeader>
                <div className="md:flex gap-2">
                    <div className="w-full">
                        <Label>Sort by</Label>
                        <Select
                            value={ sortBy }
                            onValueChange={(val) => setSortBy(val) }>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ SortTicketBy.UPDATED_DATE }>Newest or last updated</SelectItem>
                                <SelectItem value={ SortTicketBy.PRIORITY }>Highest priority</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full">
                        <Label>Search by user</Label>
                        <Input
                            className="border-b-[0.5px] border-slate-200 rounded"
                            placeholder="Search by user"
                            onChange={ (e) => setSearchUserName(e.target.value) }
                            value={ searchUserName }
                        />
                    </div>
                </div>

                <div className="md:flex gap-2">
                    <div className="w-full">
                        <Label>Search by category</Label>
                        <Select
                            value={ searchCategoryId }
                            onValueChange={(val) => setSearchCategoryId(val) }>
                            <SelectTrigger>
                                <SelectValue placeholder="Search by category" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    response.categories.map((c, i) => (
                                        <SelectItem key={ i } value={ String(c.id) }>{ c.name }</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full">
                        <Label>Search by subject</Label>
                        <Input
                            className="border-b-[0.5px] border-slate-200 rounded"
                            placeholder="Search by subject"
                            onChange={ (e) => setSearchSubject(e.target.value) }
                            value={ searchSubject }
                        />
                    </div>
                </div>

                <div className="md:flex gap-2">
                    <div className="w-full">
                        <Label>Search by priority</Label>
                        <Select
                            value={ searchPriority }
                            onValueChange={ (val) => setSearchPriority(val) }>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ TicketPriority.HIGH }>
                                    { TicketPriority.HIGH }
                                </SelectItem>
                                <SelectItem value={ TicketPriority.NORMAL }>
                                    { TicketPriority.NORMAL }
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full">
                        <Label>Search by status</Label>
                        <Select
                            value={ searchStatus }
                            onValueChange={ (val) => setSearchStatus(val) }>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ TicketStatus.SUBMITTED }>{
                                    TicketStatus.SUBMITTED }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.ON_HOLD }>
                                    { TicketStatus.ON_HOLD }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.ON_PROGRESS }>
                                    { TicketStatus.ON_PROGRESS }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.FINISHED_BY_ADMIN }>
                                    { TicketStatus.FINISHED_BY_ADMIN }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.FINISHED_BY_DIVISION }>
                                    { TicketStatus.FINISHED_BY_DIVISION }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.ASSIGNED_TO_DIVISION }>
                                    { TicketStatus.ASSIGNED_TO_DIVISION }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.REVOKED_BY_USER }>
                                    { TicketStatus.REVOKED_BY_USER }
                                </SelectItem>
                                <SelectItem value={ TicketStatus.REJECTED }>
                                    { TicketStatus.REJECTED }
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="md:flex gap-2">
                    <div className="w-full">
                        <Label>Search from date</Label>
                        <DatePicker
                            placeholder="From date"
                            date={ searchDateFrom as Date }
                            setDate={ setSearchDateFrom as SelectSingleEventHandler }/>
                    </div>
                    <div className="w-full">
                        <Label>Search to date</Label>
                        <DatePicker
                            placeholder="To date"
                            date={ searchDateTo as Date }
                            setDate={ setSearchDateTo as SelectSingleEventHandler }/>
                    </div>
                </div>

                <div className="md:flex gap-2 py-2">
                    <Button
                        className="w-full bg-red-800 hover:bg-red-500 mb-2 md:mb-0"
                        onClick={ handleReset }>RESET</Button>
                    <Button
                        className="w-full"
                        onClick={ () =>
                            handleFilter(
                                searchSubject,
                                searchCategoryId,
                                searchPriority,
                                searchStatus,
                                searchDateFrom !== undefined ?
                                    toPHPDateString(searchDateFrom) : "",
                                searchDateTo !== undefined ?
                                    toPHPDateString(searchDateTo) : "",
                                sortBy,
                                searchUserName) }>
                                    SEARCH
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Created at</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            response.tickets.data.map((d, i) => (
                                <TableRow key={ i }>
                                    <TableCell>{ i + 1}</TableCell>
                                    <TableCell>{ formatDate(d.created_at) }</TableCell>
                                    <TableCell>{ d.user_name }</TableCell>
                                    <TableCell>{ d.category }</TableCell>
                                    <TableCell>{ d.subject }</TableCell>
                                    <TableCell className={ getPriorityClassName(d.priority) }>{ d.priority }</TableCell>
                                    <TableCell className={ getStatusClassName(d.status) }>{ d.status }</TableCell>
                                    <TableCell>
                                        <Button className="w-1/4">
                                            <Link href={ route('admin.tickets.edit', d.id) }>
                                                <Edit />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>

                <TablePagination
                    links={ response.tickets.links  }/>
            </CardContent>
        </Card>
    );
}

Tickets.layout = (page : ReactNode) => <MasterLayout title={ "Tickets" } children={ page } />;

export default Tickets;
