
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Code, File } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
  language: string;
}

interface ProjectListProps {
  projects: Project[];
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onNewProject, onSelectProject }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-primary/5 border-dashed border-2 hover:border-primary/50 cursor-pointer transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Create New Project</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="rounded-full bg-primary/10 p-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <CardDescription>Start building something amazing</CardDescription>
        </CardContent>
        <CardFooter>
          <Button onClick={onNewProject} className="w-full">
            New Project
          </Button>
        </CardFooter>
      </Card>

      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectProject(project.id)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="bg-secondary p-2 rounded-md">
                {project.language === 'python' ? (
                  <File className="h-5 w-5 text-primary" />
                ) : (
                  <Code className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {project.lastModified.toLocaleDateString()}
              </span>
            </div>
            <CardTitle className="text-lg mt-2">{project.name}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => onSelectProject(project.id)}>
              Open Project
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
