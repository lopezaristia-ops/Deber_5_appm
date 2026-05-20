import { ResetPasswordPage } from "@/pages/reset-password/ui/ResetPasswordPage";
import { useSession } from "@/features/session/model/useSession";

export default function ResetPasswordScreen() {
  const { isLoading } = useSession();

  if (isLoading) return null;

  return <ResetPasswordPage />;
}