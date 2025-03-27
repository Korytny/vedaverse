
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, MessageCircle, Calendar, BookOpen, Edit } from 'lucide-react';
import { projectsData } from '@/data/projects';

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projectsData.find(p => p.id === id);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageTransition className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </PageTransition>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Communities
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to={`/admin/edit-project/${id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Project
                </Link>
              </Button>
            </div>
            
            <div className="relative h-60 md:h-80 w-full rounded-xl overflow-hidden mb-6">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{project.title}</h1>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-2">
                <h2 className="text-2xl font-bold mb-4">About this Community</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">{project.longDescription}</p>
                
                <h2 className="text-2xl font-bold mb-4">Topics Covered</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.topics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-secondary rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-secondary/30 p-6 rounded-xl space-y-6">
                <div>
                  {project.isPremium ? (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                        Premium Community
                      </span>
                      <p className="mt-2 text-2xl font-bold">${project.price}/month</p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
                        Free Community
                      </span>
                    </div>
                  )}
                  
                  <Button className="w-full">Join Community</Button>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h3 className="font-medium mb-3">Community Stats</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{project.members.toLocaleString()} Members</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      <span>{project.messages.toLocaleString()} Messages</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <span>{project.resources} Learning Resources</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default ProjectDetails;
