
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from 'lucide-react';
import { toast } from 'sonner';

type PricingCardProps = {
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
};

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false 
}: PricingCardProps) => {
  const handleSubscribe = () => {
    // This is a placeholder for actual payment logic with Supabase/Stripe
    toast.success(`Successfully subscribed to ${title} plan!`);
  };

  return (
    <motion.div
      whileHover={{ y: isPopular ? -8 : -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col ${isPopular ? 'border-primary shadow-lg' : ''}`}>
        <CardHeader>
          {isPopular && (
            <div className="mb-2">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Most Popular
              </span>
            </div>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl md:text-4xl font-display font-bold">${price}</span>
            <span className="ml-1 text-muted-foreground">/month</span>
          </div>
          <CardDescription className="mt-1">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex">
                <CheckIcon className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubscribe}
            className="w-full" 
            variant={isPopular ? "default" : "outline"}
          >
            Subscribe Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
