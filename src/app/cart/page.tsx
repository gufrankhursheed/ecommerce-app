import { auth } from "@/auth";
import CartComponent from "../components/CartComponent";

export default async function ViewCart() {
    const session = await auth();
    const user = session?.user
    
    return <>
        <CartComponent user={user}/>
    </>

}