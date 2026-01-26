import { AuthSuspenseBoundary } from "@/components/auth/suspense-boundary";
import { ResetForm } from "@/components/auth/reset-form";

const ResetPage = () => {
    return ( 
        <AuthSuspenseBoundary>
            <ResetForm />
        </AuthSuspenseBoundary>
     );
}
 
export default ResetPage;