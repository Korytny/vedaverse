
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTranslatedField } from '@/utils/getTranslatedField';
import { useTranslation } from 'react-i18next'; // Import useTranslation

type Project = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  members_count: number;
};

interface RecommendedProjectsProps {
  projects: Project[];
}

const RecommendedProjects = ({ projects }: RecommendedProjectsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook

  const handleNavigate = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recommendedCommunities.title')}</CardTitle>
        <CardDescription>{t('dashboard.recommendedCommunities.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => {
            const projectName = getTranslatedField(project.name, 'projectName');
            // const projectDescription = getTranslatedField(project.description, 'projectDesc');

            return (
              <div key={project.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                <h3 className="font-medium mb-1">{projectName}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {t('dashboard.recommendedCommunities.connectMembers', { count: project.members_count.toLocaleString() })}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleNavigate(project.id)}
                >
                  {t('dashboard.recommendedCommunities.viewCommunity')}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedProjects;
