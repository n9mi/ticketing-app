import { LucideProps } from "lucide-react"

const Icon = ({ icon: Icon, className } : { icon: React.FC<LucideProps>, className: string }) => {
    return <Icon className={ className} />
}

export default Icon;
