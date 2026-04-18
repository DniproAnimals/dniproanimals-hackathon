import { RequiredAuth } from "@/shared/components/RequiredAuth";

export default function OnboardingLayout({
  children,
}: LayoutProps<"/onboarding">) {
  return <RequiredAuth>{children}</RequiredAuth>;
}
