import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shadcn";
import { Button } from "@/shadcn/ui/button"
import { Calendar } from "@/shadcn/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcn/ui/popover"
import { SelectSingleEventHandler } from "react-day-picker";

const DatePicker = ({ placeholder, date, setDate } :
    { placeholder: string, date: Date, setDate : SelectSingleEventHandler }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{ placeholder }</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
            </PopoverContent>
        </Popover>
    );
}

export default DatePicker;
