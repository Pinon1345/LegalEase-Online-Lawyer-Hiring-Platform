import FeaturedPartners from "@/components/FeaturedPartners";
import HeroBanner from "@/components/HeroBanner";
import LegalCategories from "@/components/LegalCategories";
import PracticeAreas from "@/components/PracticeAreas";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  return (
    <div>
      <HeroBanner></HeroBanner>

      {/* Extra Sections in Home page */}

      <LegalCategories></LegalCategories>
      <StatsSection></StatsSection>
      <PracticeAreas></PracticeAreas>
      <FeaturedPartners></FeaturedPartners>

    </div>
  );
}
