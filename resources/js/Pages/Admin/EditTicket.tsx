import TablePagination from "@/Components/TablePagination";
import { TicketPriority, TicketStatus } from "@/enums/ticket";
import MasterLayout from "@/Layouts/MasterLayout";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardTitle } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/shadcn/ui/table";
import { Textarea } from "@/shadcn/ui/textarea";
import { useToast } from "@/shadcn/ui/use-toast";
import { AdminEditTicketResponse } from "@/types";
import { formatDate } from "@/utils/date";
import { useForm } from "@inertiajs/react";
import React, { ReactNode, useEffect, useState } from "react";
import { z, ZodError } from "zod";

const EditTicket = ({ response } : { response: AdminEditTicketResponse }) => {
    const formSchema = z.object({
        priority: z.string().refine((p: string) => Object.values(TicketPriority).includes(p as TicketPriority),
            { message: "invalid priority" }),
        status: z.string().refine((s: string) => Object.values(TicketStatus).includes(s as TicketStatus),
            { message: "invalid status" }),
        division: z.string().refine((d: string) => (response.divisions.filter(r => r.id === d).length > 0)
            || (d === ""),
            { message: "invalid division" }),
        comment: z.string()
    });

    const { data, setData, reset, put, errors, setError, clearErrors } = useForm({
        priority: response.ticket.priority,
        status: response.ticket.status,
        division: response.ticket.division_id === null ? "" : response.ticket.division_id,
        comment: response.ticket.comment
    });

    const [ divsDropdownShow, setDivsDropdownShow ] = useState<boolean>(
        response.ticket.status === TicketStatus.ASSIGNED_TO_DIVISION ||
        response.ticket.status === TicketStatus.FINISHED_BY_DIVISION);

    useEffect(() => {
        if (data.status === TicketStatus.ASSIGNED_TO_DIVISION
            || response.ticket.status === TicketStatus.FINISHED_BY_DIVISION) {
            setDivsDropdownShow(true);
        } else {
            setDivsDropdownShow(false);
            setData('division', '');
        }
    }, [ data.status ]);

    const isAdminAbleToEdit = () => (
        [
            TicketStatus.SUBMITTED,
            TicketStatus.ON_HOLD,
            TicketStatus.ON_PROGRESS,
            TicketStatus.ASSIGNED_TO_DIVISION
        ].includes(response.ticket.status as TicketStatus)
    );

    const { toast } = useToast();

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isAdminAbleToEdit()) {
            toast({
                title: "Error!",
                description: "Finished ticket can't be edited!",
                variant: "destructive",
            });
            return;
        }

        try {
            formSchema.parse(data);
            clearErrors();
            put(`/admin/tickets/${ response.ticket.id }`);
        } catch (e) {
            if (e instanceof ZodError) {
                for (const issue of e.issues) {
                    setError(issue.path[0] as "priority" | "status" | "division", issue.message);
                }
            }
        }
    }

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
                        <Label className="basis-1/6 text-base mt-1 font-light">Category</Label>
                        <Input
                            value={ response.ticket.category_name } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Subject</Label>
                        <Input
                            value={ response.ticket.subject } readOnly/>
                    </div>
                    <div className="md:flex my-2">
                        <Label className="basis-1/6 text-base mt-1 font-light">Description</Label>
                        <Textarea
                            value={ response.ticket.description } readOnly/>
                    </div>
                </CardContent>
            </Card>

            <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
                <CardContent className="mt-2">
                <form onSubmit={ submit }>
                        <div className="md:flex mt-4 font-bold">
                            <h6>Set ticket action</h6>
                        </div>
                        <div className="md:flex my-2">
                            <Label className="basis-1/6 text-base mt-1 font-light">Priority</Label>
                            <div className="w-full">
                                {
                                    isAdminAbleToEdit() ?
                                        <Select
                                            value={ data.priority }
                                            onValueChange={ (val) => setData('priority', val) }
                                            defaultValue={ data.priority }>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="" />
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
                                        :
                                        <Input
                                            value={ response.ticket.priority } disabled/>
                                }
                                { errors.priority &&
                                    <div className="text-sm text-red-400">
                                        { errors.priority }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="md:flex my-2">
                            <Label className="basis-1/6 text-base mt-1 font-light">Status</Label>
                            <div className="w-full">
                                {
                                    isAdminAbleToEdit() ?
                                        <Select
                                            value={ data.status }
                                            onValueChange={ (val) => setData('status', val) }
                                            defaultValue={ data.status }>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="" />
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
                                                <SelectItem value={ TicketStatus.ASSIGNED_TO_DIVISION }>
                                                    { TicketStatus.ASSIGNED_TO_DIVISION }
                                                </SelectItem>
                                                <SelectItem value={ TicketStatus.REJECTED }>
                                                    { TicketStatus.REJECTED }
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        :
                                        <Input
                                            value={ response.ticket.status } disabled/>
                                }
                                { errors.status &&
                                    <div className="text-sm text-red-400">
                                        { errors.status }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="md:flex my-2">
                            <Label className={
                                `basis-1/6 text-base mt-1 font-light ${ divsDropdownShow ? "" : "hidden" }`}>
                                    Division</Label>
                            <div className="w-full">
                                {
                                    response.ticket.status === TicketStatus.FINISHED_BY_DIVISION ?
                                        <Input
                                            value={ response.ticket.division_display_name } disabled/>
                                    :
                                        <Select
                                            value={ data.division }
                                            onValueChange={ (val) => setData('division', val) }
                                            defaultValue={ data.division === null ? "" : data.division }>
                                            <SelectTrigger className={ divsDropdownShow ? "" : "hidden" }>
                                                <SelectValue
                                                    placeholder="Assign to one of these divisions" />
                                            </SelectTrigger>
                                            <SelectContent className={ divsDropdownShow ? "" : "hidden" }>
                                                {
                                                    response.divisions.map((d, i) =>
                                                        <SelectItem key={ i } value={ d.id } >
                                                            { d.display_name }
                                                        </SelectItem>
                                                    )
                                                }
                                            </SelectContent>
                                        </Select>
                                }
                                { errors.division &&
                                    <div className="text-sm text-red-400">
                                        { errors.division }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="md:flex my-2">
                            <Label className="basis-1/6 text-base mt-1 font-light">Comment</Label>
                                {
                                    isAdminAbleToEdit() ?
                                        <Textarea
                                            value={ data.comment }
                                            onChange={ (e) => setData('comment', e.target.value) }
                                            defaultValue={ data.comment === null ? "" : data.comment } />
                                        :
                                        <Textarea
                                            value={ response.ticket.comment === null ? "" : response.ticket.comment } disabled/>
                                }
                                { errors.comment &&
                                    <div className="text-sm text-red-400">
                                        { errors.priority }
                                    </div>
                                }
                        </div>
                        {
                            isAdminAbleToEdit() ?
                                <Button
                                    type="submit"
                                    className="w-full mt-2"
                                    disabled={ !isAdminAbleToEdit() }>SUBMIT</Button>
                                    :
                                <></>
                        }
                    </form>
                </CardContent>
            </Card>

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
    <MasterLayout title="Edit ticket" children={ page } />

export default EditTicket;
