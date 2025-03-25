import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export const MainLoader = () => {
  return (
    <div className="h-full w-full relative">
      <div className="flex flex-col items-center justify-center gap-2 absolute top-1/2 left-1/2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p>Loading Editor</p>
      </div>
      <Skeleton className="h-full w-full" />
    </div>
  );
};
