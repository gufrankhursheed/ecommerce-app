import { auth } from "@/auth";
import ViewSettings from "../components/ViewSettings";

export default async function Settings() {
    const session = await auth();
    const user = session?.user

    return <>
        <ViewSettings user={user}/>
    </>

}