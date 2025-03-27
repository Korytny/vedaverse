
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Upload, User, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Form schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Update the interface for profileData to include avatar_url
interface ProfileData {
  fullName: string;
  phone: string;
  bio: string;
  avatar_url?: string;
}

const Profile = () => {
  const { user, signOut, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phone: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProfileData = async () => {
      setIsLoading(true);
      
      try {
        // Get user profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setProfileData(data);
          form.reset({
            fullName: data.full_name || user.user_metadata?.full_name || '',
            email: user.email,
            phone: data.phone || '',
            bio: data.bio || '',
          });
        } else {
          // If no profile exists, use data from auth metadata
          form.reset({
            fullName: user.user_metadata?.full_name || '',
            email: user.email,
            phone: '',
            bio: '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: values.fullName,
          phone: values.phone || null,
          bio: values.bio || null,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      // Refresh user data
      await refreshUser();
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    setIsLoading(true);
    
    try {
      // Upload avatar to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update user metadata with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicURL.publicUrl,
          updated_at: new Date().toISOString(),
        });
      
      if (updateError) throw updateError;
      
      // Refresh user data
      await refreshUser();
      
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <PageTransition className="flex-grow pt-20">
        <main className="container px-4 py-12">
          <section className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl font-display font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and account settings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative group mb-4">
                        <Avatar className="h-32 w-32 border-4 border-background">
                          <AvatarImage src={profileData?.avatar_url || user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || "User"} />
                          <AvatarFallback className="text-4xl">
                            {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0">
                          <Label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm">
                              <Upload size={16} />
                            </div>
                          </Label>
                          <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </div>
                      </div>
                      <h2 className="text-xl font-medium">{user?.user_metadata?.full_name || form.getValues().fullName || "User"}</h2>
                      <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                      <Button variant="outline" className="w-full gap-2" onClick={signOut}>
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                                  <div className="px-3 text-muted-foreground">
                                    <User size={18} />
                                  </div>
                                  <Input placeholder="Your full name" className="border-0 focus-visible:ring-0" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                                  <div className="px-3 text-muted-foreground">
                                    <Mail size={18} />
                                  </div>
                                  <Input placeholder="Your email" className="border-0 focus-visible:ring-0" {...field} disabled />
                                </div>
                              </FormControl>
                              <FormDescription>Email cannot be changed</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                                  <div className="px-3 text-muted-foreground">
                                    <Phone size={18} />
                                  </div>
                                  <Input placeholder="Your phone number" className="border-0 focus-visible:ring-0" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <textarea
                                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]"
                                  placeholder="Tell us a bit about yourself"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Saving...</span>
                            </>
                          ) : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Profile;
