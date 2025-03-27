
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { projectsData, Project } from '@/data/projects';
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

const AdminEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [newTopic, setNewTopic] = useState('');

  // In a real app, this would be fetched from Supabase
  useEffect(() => {
    const foundProject = projectsData.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      // Initialize form with project data
      form.reset({
        title: foundProject.title,
        description: foundProject.description,
        longDescription: foundProject.longDescription,
        members: foundProject.members,
        image: foundProject.image,
        isPremium: foundProject.isPremium,
        price: foundProject.price || 0,
        messages: foundProject.messages,
        resources: foundProject.resources,
      });
    }
  }, [id]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      members: 0,
      image: '',
      isPremium: false,
      price: 0,
      messages: 0,
      resources: 0,
    }
  });

  const onSubmit = (data: any) => {
    // In a real app, this would update Supabase
    if (project) {
      const updatedProject = {
        ...project,
        ...data,
        topics: [...project.topics] // Keep the current topics
      };
      
      // Here we would make an API call to update the data
      console.log('Saving project:', updatedProject);
      
      // Update the project in projectsData (simulating a database update)
      const projectIndex = projectsData.findIndex(p => p.id === id);
      if (projectIndex !== -1) {
        projectsData[projectIndex] = updatedProject;
      }
      
      // Update the local state
      setProject(updatedProject);
      
      // Show success message
      toast.success('Project updated successfully!');
      
      // Navigate back to project details
      navigate(`/project/${id}`);
    }
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;
    if (project) {
      // Make sure we're not duplicating topics
      if (project.topics.includes(newTopic.trim())) {
        toast.error('Topic already exists!');
        return;
      }
      
      // Add the new topic
      setProject({
        ...project,
        topics: [...project.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    if (project) {
      setProject({
        ...project,
        topics: project.topics.filter(topic => topic !== topicToRemove)
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
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description (shown in cards)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This appears on the project card on the homepage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longDescription"
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
              
              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Premium Project</FormLabel>
                      <FormDescription>
                        Is this a premium project that requires payment to join?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch("isPremium") && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="Enter price" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Monthly subscription price for this premium project.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Members</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Members count" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="messages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Messages</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Message count" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="resources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resources</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Resource count" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Topics</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.topics.map((topic, index) => (
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
