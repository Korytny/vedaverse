
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <section className="max-w-6xl mx-auto">
            {children}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
