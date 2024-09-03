import MasterLayout from "@/Layouts/MasterLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";

const Dashboard = () => {
    const { user } = usePage<PageProps>().props.auth;

    return (
        <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
            <CardHeader>
                <CardTitle>
                    Hello, { user.name }
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

Dashboard.layout = (page: ReactNode) => <MasterLayout title={ "Dashboard" } children={ page } />

export default Dashboard;
