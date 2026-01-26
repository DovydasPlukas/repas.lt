import { AuthSuspenseBoundary } from "@/components/auth/suspense-boundary";
import { NewPasswordForm } from "@/components/auth/new-password-form";

const NewPasswordPage = () => {
    return ( 
        <AuthSuspenseBoundary>
            <NewPasswordForm />
        </AuthSuspenseBoundary>
     );
}
 
export default NewPasswordPage;