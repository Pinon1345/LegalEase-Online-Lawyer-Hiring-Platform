import { getUser } from "@/lib/api/session";
import LawyerInvoicesView from "./LawyerInvoicesView";

export default async function LawyerInvoicesPage() {
    const user = await getUser();

    return <LawyerInvoicesView user={user} />;
}