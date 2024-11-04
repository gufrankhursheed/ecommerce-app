import { auth } from "@/auth";
import Cart from "../components/CartComponent";

export default async function ViewCart() {
    const session = await auth();
    const user = session?.user
    
    return <>
        <Cart user={user}/>
    </>

}