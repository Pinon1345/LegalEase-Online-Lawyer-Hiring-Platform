import FeaturedLawyers from "@/components/FeaturedLawyers";
import FeaturedPartners from "@/components/FeaturedPartners";
import HeroBanner from "@/components/HeroBanner";
import LegalCategories from "@/components/LegalCategories";
import PracticeAreas from "@/components/PracticeAreas";
import StatsSection from "@/components/StatsSection";
import TopLegalExperts from "@/components/TopLegalExperts";

export default function Home() {
  return (
    <div>
      <HeroBanner></HeroBanner>

      {/* Extra Sections in Home page */}

      <FeaturedLawyers></FeaturedLawyers>
      <TopLegalExperts></TopLegalExperts>
      <LegalCategories></LegalCategories>
      <StatsSection></StatsSection>
      <PracticeAreas></PracticeAreas>
      <FeaturedPartners></FeaturedPartners>

    </div>
  );
}
