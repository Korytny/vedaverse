
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PricingCard from '@/components/PricingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckIcon } from 'lucide-react';

const Pricing = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pricingPlans = {
    monthly: [
      {
        title: "Free",
        price: 0,
        description: "Perfect for getting started",
        features: [
          "Join unlimited free communities",
          "Participate in discussions",
          "Access free learning resources",
          "Create 1 personal community",
          "Basic analytics"
        ]
      },
      {
        title: "Pro",
        price: 29,
        description: "For committed community builders",
        features: [
          "Everything in Free plan",
          "Join unlimited premium communities",
          "Create up to 5 communities",
          "Advanced analytics and insights",
          "Priority support",
          "Custom community branding"
        ],
        isPopular: true
      },
      {
        title: "Enterprise",
        price: 99,
        description: "For organizations and teams",
        features: [
          "Everything in Pro plan",
          "Unlimited community creation",
          "Custom domain support",
          "SSO authentication",
          "Dedicated account manager",
          "API access",
          "Advanced security features"
        ]
      }
    ],
    annual: [
      {
        title: "Free",
        price: 0,
        description: "Perfect for getting started",
        features: [
          "Join unlimited free communities",
          "Participate in discussions",
          "Access free learning resources",
          "Create 1 personal community",
          "Basic analytics"
        ]
      },
      {
        title: "Pro",
        price: 19,
        description: "For committed community builders",
        features: [
          "Everything in Free plan",
          "Join unlimited premium communities",
          "Create up to 5 communities",
          "Advanced analytics and insights",
          "Priority support",
          "Custom community branding"
        ],
        isPopular: true
      },
      {
        title: "Enterprise",
        price: 79,
        description: "For organizations and teams",
        features: [
          "Everything in Pro plan",
          "Unlimited community creation",
          "Custom domain support",
          "SSO authentication",
          "Dedicated account manager",
          "API access",
          "Advanced security features"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <section className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your community needs
            </p>
          </section>
          
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <Tabs defaultValue="monthly" className="inline-flex">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                  <TabsTrigger value="annual">
                    Annual Billing
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Save 35%
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.monthly.map((plan, index) => (
                      <PricingCard key={index} {...plan} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annual" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.annual.map((plan, index) => (
                      <PricingCard key={index} {...plan} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="mt-16 bg-secondary/50 rounded-xl p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-6 text-center">All Plans Include</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "User-friendly interface",
                  "Community discussions",
                  "File sharing",
                  "Responsive design",
                  "Email notifications",
                  "SSL security",
                  "Community guidelines",
                  "Member management",
                  "99.9% uptime guarantee"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <div className="mt-8 grid gap-6">
                {[
                  {
                    question: "Can I upgrade or downgrade my plan?",
                    answer: "Yes, you can change your plan at any time. When upgrading, we'll prorate the remaining time on your current plan. When downgrading, the new pricing will take effect at the next billing cycle."
                  },
                  {
                    question: "Is there a free trial available?",
                    answer: "We offer a 14-day free trial on all paid plans. No credit card required to start your trial."
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, PayPal, and some regional payment methods. Enterprise customers can also pay via invoice."
                  },
                  {
                    question: "Can I get a refund if I'm not satisfied?",
                    answer: "We offer a 30-day money-back guarantee for all new paid subscriptions."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border border-border/60 rounded-lg p-6 text-left">
                    <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Pricing;
