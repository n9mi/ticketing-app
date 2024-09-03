import MasterLayout from "@/Layouts/MasterLayout";
import { Card, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { usePage } from "@inertiajs/react";
import { ReactNode } from "react";

const Home = () => {
    return (
        <Card className="my-4 shadow-none border-b-[0.5px] border-slate-200">
            <CardHeader>
                <CardTitle>
                    Home
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

Home.layout = (page: ReactNode) => <MasterLayout title={ "Home" } children={ page } />

export default Home;
