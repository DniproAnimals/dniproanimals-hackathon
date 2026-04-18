import { RequiredAuth } from "@/shared/components/RequiredAuth";
import { FavouritesSection } from "./components/FavouritesSection";
import { UserInformation } from "./components/UserInformation";

export default function ProfilePage() {
  return (
    <RequiredAuth redirectTo="/">
      <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
        <UserInformation />
        <FavouritesSection />
      </div>
    </RequiredAuth>
  );
}
