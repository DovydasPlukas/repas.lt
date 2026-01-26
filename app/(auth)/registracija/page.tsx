import { AuthSuspenseBoundary } from "@/components/auth/suspense-boundary";
import { RegisterForm } from "@/components/auth/register-form";

const RegisterPage = () => {
  return (
    <AuthSuspenseBoundary>
      <RegisterForm />
    </AuthSuspenseBoundary>
  );
}
 
export default RegisterPage;