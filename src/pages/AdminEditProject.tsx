
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const AdminEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setProject(data);
        
        // Initialize form with project data
        form.reset({
          title: data.name,
          description: data.description,
          short_description: data.short_description || '',
          image: data.image_url,
          members: data.members_count || 0,
          isPremium: false,
          price: 0,
        });
      } catch (error) {
        console.error("Error fetching community details:", error);
        toast.error("Failed to load community details");
      }
    };

    fetchCommunityDetails();
  }, [id]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      short_description: '',
      image: '',
      members: 0,
      isPremium: false,
      price: 0,
    }
  });

  const onSubmit = async (data: any) => {
    if (!project) return;

    try {
      const { error } = await supabase
        .from('communities')
        .update({
          name: data.title,
          description: data.description,
          short_description: data.short_description,
          image_url: data.image,
          members_count: data.members,
          topics: project.topics || []
        })
        .eq('id', project.id);

      if (error) throw error;
      
      toast.success('Community updated successfully!');
      navigate(`/project/${id}`);
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("Failed to update community");
    }
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;
    if (project) {
      // Make sure we're not duplicating topics
      if (project.topics?.includes(newTopic.trim())) {
        toast.error('Topic already exists!');
        return;
      }
      
      // Add the new topic
      const updatedTopics = [...(project.topics || []), newTopic.trim()];
      setProject({
        ...project,
        topics: updatedTopics
      });
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    if (project) {
      const updatedTopics = (project.topics || []).filter(topic => topic !== topicToRemove);
      setProject({
        ...project,
        topics: updatedTopics
      });
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container px-4 py-12 flex-grow">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/project/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This appears on the project details page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description (shown in cards)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This appears on community cards and lists. Keep it concise.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <Label>Topics</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.topics?.map((topic, index) => (
                    <Badge key={index} className="group">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="ml-2 opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a new topic"
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTopic();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTopic}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminEditProject;
