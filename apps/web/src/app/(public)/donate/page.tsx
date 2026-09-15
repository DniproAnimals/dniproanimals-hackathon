import { DonateBackground } from "./components/DonateBackground";
import { ForeignCurrencyAccount } from "./components/DonateBankDetails";
import { CorrespondentBanks } from "./components/DonateBankDetails/CorrespondentBanks";
import { DirectBankDetails } from "./components/DonateBankDetails/DirectBankDetails";
import { DonateContact } from "./components/DonateContact";
import { DonateHero } from "./components/DonateHero";
import ShelterNeedsSection from "./components/ShelterNeedsSection/ShelterNeedsSection";

export default function DonatePage() {
  return (
    <div className="relative z-0 min-h-screen bg-[#fcfcfc] text-foreground selection:bg-primary selection:text-primary-foreground">
      <DonateBackground />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* Hero + direct bank details */}
        <section className="mb-12 grid grid-cols-1 items-center gap-8 sm:gap-10 lg:mb-16 lg:grid-cols-2 lg:gap-16">
          <DonateHero />

          <div className="w-full">
            <DirectBankDetails />
          </div>
        </section>

        {/* Foreign currency + correspondent banks */}
        <section className="mb-12 grid grid-cols-1 items-start gap-6 sm:gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-10">
          <ForeignCurrencyAccount />
          <CorrespondentBanks />
        </section>

        <ShelterNeedsSection />

        <DonateContact />
      </main>
    </div>
  );
}
