
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Info, MessageCircle, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CommunityCard from '@/components/CommunityCard';
import { Input } from '@/components/ui/input';

// Mock community data - would be fetched from Supabase in real implementation
const communitiesData = [
  {
    id: "1",
    title: "Web Development Mastery",
    description: "Learn modern web development with expert mentors and a supportive community. Covers React, Node.js, and more.",
    members: 2543,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "2",
    title: "Design Thinking Pro",
    description: "Elevate your design skills with feedback from industry professionals. Includes UX/UI design principles and case studies.",
    members: 1872,
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=2072&auto=format&fit=crop",
    isPremium: true,
    price: 29.99
  },
  {
    id: "3",
    title: "Data Science Community",
    description: "Master data analysis and machine learning with practical projects and expert guidance.",
    members: 3215,
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2070&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "4",
    title: "Entrepreneurship Guild",
    description: "Connect with founders and business experts to accelerate your startup journey.",
    members: 1432,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    isPremium: true,
    price: 49.99
  },
  {
    id: "5",
    title: "Creative Writing Workshop",
    description: "Develop your writing skills with structured feedback and community support.",
    members: 987,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "6",
    title: "AI & Machine Learning Pro",
    description: "Dive deep into artificial intelligence with hands-on projects and expert mentorship.",
    members: 2145,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2145&auto=format&fit=crop",
    isPremium: true,
    price: 39.99
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommunities, setFilteredCommunities] = useState(communitiesData);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Apply search filter
    if (searchQuery) {
      const filtered = communitiesData.filter(community => 
        community.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communitiesData);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section id="hero">
          <Hero />
        </section>
        
        <section id="features">
          <FeaturesSection />
        </section>
        
        {/* Communities Section */}
        <section id="communities" className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Explore Communities</h2>
              <p className="text-lg text-muted-foreground">
                Join communities that match your interests and learning goals
              </p>
              
              <div className="relative max-w-lg mx-auto mt-8">
                <Input
                  placeholder="Search communities..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
              </div>
            </motion.div>
            
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                  <CommunityCardWithInfo key={community.id} {...community} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No communities found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search</p>
                <Button onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Stats Section */}
        <section id="stats" className="py-20 bg-secondary/50">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trusted by creators worldwide</h2>
              <p className="text-lg text-muted-foreground">Join a growing community of knowledge creators and learners</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard 
                icon={<Users className="w-10 h-10" />}
                value="10,000+"
                label="Active Members"
              />
              <StatCard 
                icon={<BookOpen className="w-10 h-10" />}
                value="500+"
                label="Learning Communities"
              />
              <StatCard 
                icon={<MessageCircle className="w-10 h-10" />}
                value="25,000+"
                label="Daily Discussions"
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-12 md:p-16 text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to build your community?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Start your journey today and connect with passionate learners from around the world.
                </p>
                <Button 
                  size="lg" 
                  className="rounded-full px-8 text-base h-12"
                  asChild
                >
                  <Link to="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white p-8 rounded-xl border border-border/40 text-center"
    >
      <div className="mx-auto text-primary mb-4">{icon}</div>
      <p className="text-3xl font-display font-bold mb-1">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
};

const CommunityCardWithInfo = (props) => {
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
      <div className="relative h-40">
        <img 
          src={props.image} 
          alt={props.title} 
          className="w-full h-full object-cover"
        />
        {props.isPremium && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            Premium
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-xl mb-2">{props.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{props.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{props.members.toLocaleString()} members</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/project/${props.id}`}>
              <Button size="sm" variant="outline">
                <Info className="h-4 w-4 mr-1" />
                Info
              </Button>
            </Link>
            <Button size="sm">Join</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
