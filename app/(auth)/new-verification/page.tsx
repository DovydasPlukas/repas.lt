import { AuthSuspenseBoundary } from "@/components/auth/suspense-boundary";
import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = () => {
    return ( 
        <AuthSuspenseBoundary>
            <NewVerificationForm />
        </AuthSuspenseBoundary>
     );
}
 
export default NewVerificationPage;