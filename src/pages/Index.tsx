
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import CodePreview from '@/components/CodePreview';
import ProjectList from '@/components/ProjectList';
import AISettings from '@/components/AISettings';
import { useToast } from '@/components/ui/use-toast';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';


interface CodeFile {
  name: string;
  content: string;
  language?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [code, setCode] = useState<string>('// Your code will appear here...');
  const [projectFiles, setProjectFiles] = useState<CodeFile[]>([]);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  // const navigate = useNavigate();

  // Install jszip dependency for downloading project files
  useEffect(() => {
    const loadJsZip = async () => {
      try {
        await import('jszip');
      } catch (err) {
        console.error("Failed to load jszip:", err);
      }
    };
    
    loadJsZip();
  }, []);

  // Mock projects data
  const mockProjects = [
    {
      id: '1',
      name: 'Todo App',
      description: 'A simple todo application with React',
      lastModified: new Date(2025, 4, 5),
      language: 'javascript'
    },
    {
      id: '2',
      name: 'Data Analysis',
      description: 'Python script for data processing',
      lastModified: new Date(2025, 4, 7),
      language: 'python'
    },
    {
      id: '3',
      name: 'Weather Dashboard',
      description: 'Weather visualization using React',
      lastModified: new Date(2025, 4, 8),
      language: 'javascript'
    }
  ];

  const handleNewProject = () => {
    toast({
      title: "Create new project",
      description: "This would open the project creation wizard in a real app.",
    });
  };

  const handleSelectProject = (id: string) => {
    toast({
      title: "Project selected",
      description: `Selected project with ID: ${id}`,
    });
  };

  const handleCodeGenerated = (generatedCode: string) => {
    setCode(generatedCode);
  };

  const handleProjectFilesGenerated = (files: CodeFile[]) => {
    setProjectFiles(files);
  };

  const handleEditCode = (editedCode: string) => {
    setCode(editedCode);
  };

  const handleEditFiles = (editedFiles: CodeFile[]) => {
    setProjectFiles(editedFiles);
  };

return (
  <div className="flex flex-col min-h-screen">
    <Header 
      onNewProject={handleNewProject}
      onOpenSettings={() => setSettingsOpen(true)} 
    />
    
    <main className="flex-1 container px-4 py-6">
      <Tabs defaultValue="chat" className="h-full" onValueChange={setActiveTab}>
      <TabsList className="mb-4">
            <TabsTrigger value="chat">Chat & Code</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
        
        <TabsContent value="chat" className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <ChatInterface 
              onCodeGenerated={handleCodeGenerated} 
              onProjectFilesGenerated={handleProjectFilesGenerated}
            />
            <CodePreview 
              code={code} 
              files={projectFiles}
              onEditCode={handleEditCode}
              onEditFiles={handleEditFiles}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Projects</h2>
            <ProjectList 
              projects={mockProjects} 
              onNewProject={handleNewProject}
              onSelectProject={handleSelectProject}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </main>
    
    <AISettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    
    <footer className="border-t py-3 text-center text-sm text-muted-foreground">
      <p>Ahex CodeGen  App - Python LangGraph + OpenAI - {new Date().getFullYear()}</p>
    </footer>
  </div>
);
};

export default Index;





