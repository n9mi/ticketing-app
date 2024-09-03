import MasterLayout from "@/Layouts/MasterLayout";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { Category } from "@/types";
import { useForm } from "@inertiajs/react";
import { ReactNode } from "react";
import { z } from "zod";

const CreateTicket = ({ categories } : { categories : Category[] }) => {
    const formSchema = z.object({
        category_id: z.string().refine((d: string) =>
            (categories.filter((c) => String(c.id) === d).length > 0 && Number(d) > 0),
            { message: "category doesn't exists" }),
        subject: z.string().min(1,
            { message: "subject is required" }),
        description: z.string().min(1,
            { message: "description is required" }),
    });

    const { data, setData, reset, post, errors, setError, clearErrors } = useForm({
        category_id: "0",
        subject: "",
        description: ""
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            formSchema.parse(data);
            clearErrors();
            post("/customer/create-ticket", {
                onSuccess: () => {
                    reset();
                }
            });
        } catch (e) {
            if (e instanceof z.ZodError) {
                for (const issue of e.issues) {
                    const label = issue.path[0];
                    setError(issue.path[0] as "category_id" | "subject" | "description", issue.message);
                }
            };
        }
    }

    return (
        <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
            <CardContent className="mt-2">
                <form onSubmit={ submit }>
                    <div className="my-2">
                        <Label>Category</Label>
                        <Select
                            value={ data.category_id }
                            onValueChange={ (v) => setData("category_id", v) }
                            defaultValue={ String(0) }>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    categories.map((c, i) =>
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
                        { errors.category_id &&
                            <div className="text-sm text-red-400">
                                { errors.category_id }
                            </div>
                        }
                    </div>
                    <div className="my-2">
                        <Label>Subject</Label>
                        <Input
                            value={ data.subject }
                            onChange={ (e) => setData("subject", e.target.value) }
                            placeholder="Input your subject" />
                        { errors.subject &&
                            <div className="text-sm text-red-400">
                                { errors.subject }
                            </div>
                        }
                    </div>
                    <div className="my-2">
                        <Label>Description</Label>
                        <Textarea
                            value={ data.description }
                            onChange={ (e) => setData("description", e.target.value) }
                            placeholder="Tell us the details" />
                        { errors.description &&
                            <div className="text-sm text-red-400">
                                { errors.description }
                            </div>
                        }
                    </div>
                    <div className="mt-8">
                        <Button type="submit" className="w-full">SUBMIT</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

CreateTicket.layout = (page: ReactNode) => <MasterLayout title={ "Create a Ticket" } children={ page } />

export default CreateTicket;
