import FeaturedPartners from "@/components/FeaturedPartners";
import HeroBanner from "@/components/HeroBanner";
import LegalCategories from "@/components/LegalCategories";
import PracticeAreas from "@/components/PracticeAreas";

export default function Home() {
  return (
    <div>
      <HeroBanner></HeroBanner>

      {/* Extra Sections in Home page */}

      <LegalCategories></LegalCategories>
      <PracticeAreas></PracticeAreas>
      <FeaturedPartners></FeaturedPartners>

    </div>
  );
}
