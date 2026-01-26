import { AuthSuspenseBoundary } from "@/components/auth/suspense-boundary";
import { LoginForm } from "@/components/auth/login-form";

const LoginPage = () => {
  return (
    <AuthSuspenseBoundary>
      <LoginForm/>
    </AuthSuspenseBoundary>
  );
}
 
export default LoginPage;