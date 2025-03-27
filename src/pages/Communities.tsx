
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import CommunityCard from '@/components/CommunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

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

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [filteredCommunities, setFilteredCommunities] = useState(communitiesData);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let filtered = communitiesData;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(community => 
        community.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (currentTab === "free") {
      filtered = filtered.filter(community => !community.isPremium);
    } else if (currentTab === "premium") {
      filtered = filtered.filter(community => community.isPremium);
    }
    
    setFilteredCommunities(filtered);
  }, [searchQuery, currentTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <section className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Discover Communities</h1>
            <p className="text-xl text-muted-foreground">
              Find and join communities aligned with your interests and learning goals
            </p>
          </section>
          
          <section className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto">
                <Tabs 
                  defaultValue="all" 
                  value={currentTab} 
                  onValueChange={setCurrentTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="free">Free</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </section>
          
          <section>
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                  <CommunityCard key={community.id} {...community} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No communities found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setCurrentTab("all");
                }}>
                  Clear filters
                </Button>
              </div>
            )}
          </section>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Communities;
