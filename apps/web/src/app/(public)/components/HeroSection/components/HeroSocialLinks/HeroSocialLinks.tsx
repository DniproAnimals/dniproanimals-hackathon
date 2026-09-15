import { SocialLinksPills } from "@/shared/components/Contacts/SocialLinks";

export function HeroSocialLinks() {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
        Слідкуйте за життям хвостиків:
      </p>
      <SocialLinksPills />
    </div>
  );
}
