import MainLayout from "@/layouts/MainLayout";
import { Hero } from "@/components/hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <About />
      <Services />
      <ContactForm />
    </MainLayout>
  );
};

export default Index;
