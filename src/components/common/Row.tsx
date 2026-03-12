import { cn } from "@/lib/utils";

interface IRow {
  className?: string;
  children: React.ReactNode;
}

const Row: React.FC<IRow> = ({ className, children }) => {
  return <div className={cn("flex items-center", className)}>{children}</div>;
};

export default Row;
