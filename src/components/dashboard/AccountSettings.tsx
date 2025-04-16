
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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
import { Upload, User, Mail, Phone, Loader2 } from 'lucide-react'; // Import Loader2
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useTranslation } from 'react-i18next';

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormData {
  fullName: string;
  phone: string;
  bio: string;
}

const AccountSettings = () => {
  const { user, refreshUser, profileAvatarUrl } = useAuth(); 
  const { t } = useTranslation(); 
  const [isLoading, setIsLoading] = useState(false); // General loading state for form submission/avatar upload
  const [isFetchingProfile, setIsFetchingProfile] = useState(true); // Specific state for initial profile fetch

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: user?.email || "",
      phone: "",
      bio: "",
    },
  });

  // Effect to fetch only editable profile data
  useEffect(() => {
    if (!user) {
      console.warn("AccountSettings: User not available yet.");
      setIsFetchingProfile(false); // Stop fetching if no user
      return;
    }

    const fetchProfileData = async () => {
      setIsFetchingProfile(true); // Start fetching profile
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, bio')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        const defaultName = user.user_metadata?.full_name || '';
        form.reset({
          fullName: data?.full_name || defaultName,
          email: user.email,
          phone: data?.phone || '',
          bio: data?.bio || '',
        });

      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(t('dashboard.accountSettings.toastLoadError', 'Failed to load profile data'));
      } finally {
        setIsFetchingProfile(false); // Finish fetching profile
      }
    };

    fetchProfileData();
  }, [user, form, t]); 

  // onSubmit remains the same
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: values.fullName,
          phone: values.phone || null,
          bio: values.bio || null,
          updated_at: new Date().toISOString(),
        } as any);
       if (profileError) throw profileError;
       
       if (user.user_metadata?.full_name !== values.fullName) {
           const { error: authError } = await supabase.auth.updateUser({
               data: { full_name: values.fullName }
           });
           if (authError) {
               console.warn("Failed to update auth user metadata (name):", authError);
           } 
       }

      await refreshUser(); 
      toast.success(t('dashboard.accountSettings.toastUpdateSuccess', 'Profile updated successfully'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('dashboard.accountSettings.toastUpdateError', 'Failed to update profile'));
    } finally {
      setIsLoading(false);
    }
  };

  // handleAvatarUpload remains the same (can be removed if decided)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}?t=${Date.now()}`;
    const filePath = `${user.id}/${fileName}`;
    
    setIsLoading(true); // Use general loading state
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      const publicURL = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: publicURL,
          updated_at: new Date().toISOString(),
        } as any);
      if (updateProfileError) throw updateProfileError;
      
      // Refresh context to get the new avatar URL via fetchProfileAvatar in context
      await refreshUser(); 

      toast.success(t('dashboard.accountSettings.toastAvatarSuccess', 'Avatar updated successfully'));
    } catch (error) { 
      console.error('Error uploading avatar:', error);
      toast.error(t('dashboard.accountSettings.toastAvatarError', 'Failed to update avatar'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loader while fetching initial profile or if user is not yet available
  if (isFetchingProfile || !user) { 
     return (
        <div className="flex items-center justify-center p-8">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
     );
  }
  
  const displayName = user.user_metadata?.full_name || form.getValues().fullName || 'User';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <Avatar className="h-32 w-32 border-4 border-background">
                  {/* Use profileAvatarUrl from context */}
                  <AvatarImage src={profileAvatarUrl ?? undefined} alt={displayName} /> 
                  <AvatarFallback className="text-4xl">
                    {(displayName[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                 {/* *** IF YOU WANT TO REMOVE MANUAL UPLOAD, DELETE THIS DIV *** */}
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm">
                      <Upload size={16} />
                    </div>
                  </Label>
                  <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isLoading} />
                </div>
              </div>
              <h2 className="text-xl font-medium">{displayName}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form part */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.accountSettings.cardTitle', 'Personal Information')}</CardTitle>
            <CardDescription>{t('dashboard.accountSettings.cardDescription', 'Update your personal details')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.accountSettings.labelFullName', 'Full Name')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <div className="px-3 text-muted-foreground">
                            <User size={18} />
                          </div>
                          <Input placeholder={t('dashboard.accountSettings.placeholderFullName', 'Your full name')} className="border-0 focus-visible:ring-0" {...field} />
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
                      <FormLabel>{t('dashboard.accountSettings.labelEmail', 'Email')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <div className="px-3 text-muted-foreground">
                            <Mail size={18} />
                          </div>
                          <Input placeholder="Your email" className="border-0 focus-visible:ring-0 bg-muted/50 cursor-not-allowed" {...field} disabled />
                        </div>
                      </FormControl>
                      <FormDescription>{t('dashboard.accountSettings.descEmailUnchangeable', 'Email cannot be changed')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.accountSettings.labelPhone', 'Phone Number')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <div className="px-3 text-muted-foreground">
                            <Phone size={18} />
                          </div>
                          <Input placeholder={t('dashboard.accountSettings.placeholderPhone', 'Your phone number')} className="border-0 focus-visible:ring-0" {...field} />
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
                      <FormLabel>{t('dashboard.accountSettings.labelBio', 'Bio')}</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]"
                          placeholder={t('dashboard.accountSettings.placeholderBio', 'Tell us a bit about yourself')}
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
                      <span>{t('dashboard.accountSettings.buttonSaving', 'Saving...')}</span>
                    </>
                  ) : (
                    t('dashboard.accountSettings.buttonSaveChanges', 'Save Changes')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
