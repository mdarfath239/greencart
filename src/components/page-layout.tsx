import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
