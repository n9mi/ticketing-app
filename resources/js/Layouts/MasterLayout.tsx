import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
import { Toaster } from "@/shadcn/ui/toaster";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";

const MasterLayout = ({ title, children } : { title : string, children : ReactNode }) => {
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;
    const [ sidebarShow, setSidebarShow ] = useState<boolean>(false);

    const { auth } = usePage<PageProps>().props;
    const currRoute = route().current() || "";

    return (
        <div className="flex">
            <Sidebar
                sidebarShow={ sidebarShow }
                setSidebarShow={ setSidebarShow }
                isAuthenticated={ auth.user !== null }
                roles={ auth.roles }
                currRoute={ currRoute }/>
            <div className="flex flex-col overflow-hidden">
                <Header
                    title={ title }
                    sidebarShow={ sidebarShow }
                    isMobile={ isMobile }
                    user={ auth.user }/>
                <Toaster />
                <div className="px-8 min-h-screen bg-slate-100">
                    {  children }
                </div>
            </div>
        </div>
    );
}

export default MasterLayout;
