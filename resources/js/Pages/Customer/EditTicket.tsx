import TablePagination from "@/Components/TablePagination";
import { TicketStatus } from "@/enums/ticket";
import MasterLayout from "@/Layouts/MasterLayout";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardTitle } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Textarea } from "@/shadcn/ui/textarea";
import { useToast } from "@/shadcn/ui/use-toast";
import { CustomerEditTicketResponse, PageProps } from "@/types";
import { getTicketPriorityDefaultBgColor, getTicketStatusDefaultBgColor } from "@/utils/color";
import { formatDate } from "@/utils/date";
import { Link, useForm, usePage } from "@inertiajs/react";
import { ReactNode, useEffect } from "react";
import { z } from "zod";

const EditTicket = ({ response } : { response : CustomerEditTicketResponse }) => {
    const formSchema = z.object({
        category_id: z.string().refine((d: string) =>
            (response.categories.filter((c) => String(c.id) === d).length > 0 && Number(d) > 0),
            { message: "category doesn't exists" }),
        subject: z.string().min(1,
            { message: "subject is required" }),
        description: z.string().min(1,
            { message: "description is required" }),
    });

    const { data, setData, reset, put, errors, setError, clearErrors } = useForm({
        category_id: String(response.ticket.category_id),
        subject: response.ticket.subject,
        description: response.ticket.description
    });

    const isCustomerAbleToEdit = () => ( response.ticket.status === TicketStatus.SUBMITTED );

    const { toast } = useToast();

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (response.ticket.status !== TicketStatus.SUBMITTED) {
            toast({
                title: "Error!",
                description: "Processed ticket can't be edited!",
                variant: "destructive",
            });
            return;
        }
        try {
            formSchema.parse(data);
            clearErrors();
            put(`/customer/update-ticket/${ response.ticket.id }`, {
                onSuccess: () => {
                    reset();
                }
            });
        } catch (e) {
            if (e instanceof z.ZodError) {
                for (const issue of e.issues) {
                    setError(issue.path[0] as "category_id" | "subject" | "description", issue.message);
                }
            };
        }
    }

    const canBeRevoked = () => (
        [
            TicketStatus.SUBMITTED.toString(),
            TicketStatus.ON_HOLD.toString(),
            TicketStatus.ON_PROGRESS.toString(),
            TicketStatus.ASSIGNED_TO_DIVISION.toString()
        ].includes(response.ticket.status)
    );

    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.error !== null) {
            toast({
                title: "Error!",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [ flash ]);

    return (
        <>
            <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
                <CardContent className="mt-2">
                    <div className="md:flex font-bold">
                        <h6>Ticket information</h6>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Ticket ID</Label>
                        <Input
                            value={ response.ticket.id } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">User</Label>
                        <Input
                            value={ response.ticket.user_name } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Created at</Label>
                        <Input
                            value={ formatDate(response.ticket.created_at) } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Updated at</Label>
                        <Input
                            value={ formatDate(response.ticket.updated_at) } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Priority</Label>
                        <Input
                            value={ response.ticket.priority } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Status</Label>
                        <Input
                            value={ response.ticket.status } readOnly/>
                    </div>
                </CardContent>
            </Card>

            <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
                <CardContent className="mt-2">
                    <div className="md:flex font-bold">
                        <h6>Edit ticket</h6>
                    </div>
                    <form onSubmit={ submit }>
                        <div className="md:flex my-2">
                            <Label className="basis-1/6 text-base mt-1 font-light">Category</Label>
                            <div className="w-full">
                                {
                                    isCustomerAbleToEdit() ?
                                        <Select
                                            value={ String(data.category_id) }
                                            onValueChange={ (v) => setData("category_id", v) }
                                            defaultValue={ String(response.ticket.category_id) }>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    response.categories.map((c, i) =>
                                                        (
                                                            <SelectItem
                                                                key={ i }
                                                                value={ String(c.id) }>
                                                                    { c.name }
                                                            </SelectItem>
                                                        ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        :
                                    <Input
                                        value={ response.ticket.category_name } disabled/>
                                }
                                { errors.category_id &&
                                    <div className="text-sm text-red-400">
                                        { errors.category_id }
                                    </div> }
                            </div>
                        </div>
                        <div className="md:flex my-2">
                            <Label className="basis-1/6 text-base mt-1 font-light">Subject</Label>
                            <div className="w-full">
                                {
                                    isCustomerAbleToEdit() ?
                                    <Input
                                        value={ data.subject }
                                        onChange={ (e) => setData("subject", e.target.value) }
                                        placeholder="Input your subject" />
                                    :
                                    <Input
                                        value={ response.ticket.subject } disabled/>
                                }
                                { errors.category_id &&
                                    <div className="text-sm text-red-400">
                                        { errors.category_id }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="md:flex my-2">
                            <Label className="basis-1/6 text-base mt-1 font-light">Description</Label>
                            <div className="w-full">
                                {
                                    isCustomerAbleToEdit() ?
                                    <Textarea
                                        value={ data.description }
                                        onChange={ (e) => setData("description", e.target.value) }
                                        placeholder="Tell us the details" />
                                    :
                                    <Textarea
                                        value={ response.ticket.description } disabled/>
                                }
                                { errors.description &&
                                    <div className="text-sm text-red-400">
                                        { errors.description }
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            isCustomerAbleToEdit() ?
                            <Button
                                type="submit"
                                className="w-full mt-4">SUBMIT</Button>
                                : <></>
                        }
                    </form>
                </CardContent>
            </Card>

            {
                canBeRevoked() ?
                    <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
                        <CardContent className="mt-2">
                            <div className="my-2">
                                <h6 className="font-bold">Revoke this ticket</h6>
                                <p className="text-sm mt-1 text-slate-500 text-justify">Revoking a ticket means you unsubmit the ticket or mark ticket as finished by yourself.
                                    Tickets can't be revoked after admins mark them as ON PROGRESS, ON HOLD, ASSIGNED TO DIVISION, or FINISHED.</p>
                            </div>
                            <div className="mt-4">
                                <Link
                                    className="w-full py-1 rounded bg-red-950 hover:bg-red-800 text-white"
                                    href={ route('customer.revoke-ticket', response.ticket.id) }
                                    method="patch"
                                    as="button">
                                        REVOKE
                                </Link>
                            </div>
                        </CardContent>
                    </Card> : <></>
            }

            <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
                <CardContent>
                    <CardTitle className="mt-4 mb-2">Ticket Actions</CardTitle>
                    <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>By user</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Comment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                response.actions.data.map((a, i) => (
                                    <TableRow key={ i }>
                                        <TableCell>{ formatDate(a.created_at) }</TableCell>
                                        <TableCell>{ a.user_name }</TableCell>
                                        <TableCell>{ a.description }</TableCell>
                                        <TableCell>{ a.comment }</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>

                    <TablePagination
                        links={ response.actions.links } />
                </CardContent>
            </Card>
        </>
    );
}

EditTicket.layout = (page: ReactNode) =>
    <MasterLayout title="Update a Ticket" children={ page } />

export default EditTicket;
