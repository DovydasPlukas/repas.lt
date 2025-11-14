"use client";

import { UserInfo } from "@/components/auth/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = async () => {
    const user = useCurrentUser();

    return ( 
        <UserInfo 
        label="Client component"
        user={user}
        />
     );
}
 
export default ClientPage;