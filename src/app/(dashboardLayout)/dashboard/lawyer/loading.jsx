import { Loader2 } from "lucide-react";

export default function Loading() {
    return <div className="flex flex-col items-center justify-center h-[85vh] gap-3">
        <Loader2 size={56} className="animate-spin text-secondary" />
    </div>;
};