import { Role } from "@/types";
import { Link } from "@inertiajs/react";
import { ChevronLeftCircle, ChevronRightCircle, Home, LayoutDashboard, LucideProps, Ticket, TicketPlus } from "lucide-react";
import React from "react";
import Icon from "./Icon";

const SidebarLabel = ({ sidebarShow, label } : { sidebarShow : boolean, label : string }) => {
    return (
        <div
            className={`mt-2 text-sm font-semibold text-slate-800 ${ sidebarShow ? "block" : "hidden" }`}>
                { label }</div>
    );
}

const SidebarItem = ({ sidebarShow, href, isActive, label, icon } :
    { sidebarShow : boolean, href : string, isActive : boolean, label : string, icon: React.FC<LucideProps> }) => {

    return (
        <Link
            href={ href }
            className= { `p-1 rounded flex my-1 ${ isActive ? "bg-slate-800 text-white" : "" }` }>
                <Icon
                    icon={ icon }
                    className={ `${ sidebarShow ? "mr-2" : ""} ${ isActive ? "bg-slate-800 text-white" : "" }` } />
                <div
                    className={ `${ sidebarShow ? "" : "hidden"}` }>
                        { label }</div>
            </Link>
    );
}


const Sidebar = ({ sidebarShow, setSidebarShow, isAuthenticated, roles, currRoute } :
    { sidebarShow : boolean, setSidebarShow : React.Dispatch<React.SetStateAction<boolean>>,
        isAuthenticated : boolean, roles : Role[], currRoute : string }) => {

    return (
        <div
            className={ `relative flex flex-col flex-none min-h-screen p-2 bg-white border-r-[0.5px] border-slate-200 text-slate-700 transition-[width] duration-500 ${ sidebarShow ? "w-72" : "w-[60px] place-items-center"}` }>
            <div
                className="p-1 rounded"
                onClick={() => setSidebarShow(!sidebarShow)}>
                    { sidebarShow ? <ChevronLeftCircle /> : <ChevronRightCircle /> }
                </div>

            <SidebarLabel
                sidebarShow={ sidebarShow }
                label="Home" />
            <SidebarItem
                sidebarShow={ sidebarShow }
                isActive={ currRoute === "home" }
                href={ route("home") }
                label="Home"
                icon={ Home } />

            {
                isAuthenticated ?
                <>
                    <SidebarLabel
                        sidebarShow={ sidebarShow }
                        label="General" />
                    <SidebarItem
                        sidebarShow={ sidebarShow }
                        isActive={ currRoute === "dashboard" }
                        href={ route("dashboard") }
                        label="Dasboard"
                        icon={ LayoutDashboard } />
                </> : <></>
            }


            {
                roles !== null ?
                roles.map((r, i) => (
                    <div key={ i }>
                        <SidebarLabel
                            sidebarShow={ sidebarShow }
                            label={ r.display_name } />
                        {
                            getRouteItems(r.id).map((e, i) => (
                                <SidebarItem
                                    key={ i }
                                    sidebarShow={ sidebarShow }
                                    isActive={ currRoute.startsWith(e.route)
                                        || e.includeRoutes.includes(currRoute) }
                                    href={ route(e.route) }
                                    label={ e.label }
                                    icon={ e.icon } />
                            ))
                        }
                    </div>
                )) : <></>
            }
        </div>
    );
}

interface RouteItem {
    route: string,
    label: string,
    icon: React.FC<LucideProps>
    includeRoutes: string[]
}

const getRouteItems = (role_id : string) : RouteItem[] => {
    switch (role_id) {
        case "role_admin":
            return [
                {
                    route: "admin.tickets",
                    label: "Tickets",
                    icon: Ticket,
                    includeRoutes: []
                }
            ]

        case "role_customer":
            return [
                {
                    route: "customer.my-tickets",
                    label: "My Tickets",
                    icon: Ticket,
                    includeRoutes: [
                        'customer.edit-ticket'
                    ]
                },
                {
                    route: "customer.create-ticket",
                    label: "Create a Ticket",
                    icon: TicketPlus,
                    includeRoutes: []
                }
            ]

        default:
            return [

            ]
    }
}

export default Sidebar;
