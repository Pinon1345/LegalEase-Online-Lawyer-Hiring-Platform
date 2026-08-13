import { headers } from "next/headers"
import { auth } from "../auth"
import { redirect } from "next/navigation";

export const getUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.user || null;
};



export const roleValidator = async (role) => {

    const user = await getUser();

    if (!user || user.role !== role) {
        redirect("/unauthorized");
    };
}