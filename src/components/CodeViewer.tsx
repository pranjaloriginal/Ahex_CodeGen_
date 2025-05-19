
import React from "react";
import { useAgentContext } from "../contexts/AgentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Code, Copy, Github, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { pushToGithub } from "../services/agentService";
import Sandpack from "./Sandpack";

const CodeViewer: React.FC = () => {
  const { selectedFile, sessionInfo, projectFiles } = useAgentContext();
  const { toast } = useToast();
  const [githubUsername, setGithubUsername] = React.useState("");
  const [repoName, setRepoName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("code");
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [showFileExplorer, setShowFileExplorer] = React.useState(false);

  // Debug projectFiles
  React.useEffect(() => {
    console.log("CodeViewer project files:", projectFiles);
  }, [projectFiles]);

  const handleCopyCode = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      toast({
        description: "Code copied to clipboard",
      });
    }
  };

  const handleRefreshPreview = () => {
    // Force a refresh of the preview by changing the key
    setRefreshKey(prev => prev + 1);
  };

  const handleToggleFileExplorer = () => {
    setShowFileExplorer(prev => !prev);
  };

  const handlePushToGithub = async () => {
    if (!sessionInfo) {
      toast({
        title: "Error",
        description: "No active session",
        variant: "destructive",
      });
      return;
    }

    if (!githubUsername.trim() || !repoName.trim()) {
      toast({
        title: "Error",
        description: "GitHub username and repository name are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await pushToGithub(
        sessionInfo.sessionId,
        repoName,
        githubUsername
      );

      toast({
        title: "Success",
        description: `Project pushed to GitHub: ${result.repo_url}`,
      });

      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to push to GitHub",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedFile) {
    return (
      <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
        <div className="p-3 border-b bg-muted/20">
          <h3 className="text-sm font-medium">Code Viewer</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Select a file from the file browser to view its content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      <div className="p-3 border-b bg-muted/20 flex justify-between items-center">
        <h3 className="text-sm font-medium">
          {selectedFile.path}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-8 w-8 p-0"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFileExplorer}
            className="h-8 w-8 p-0"
            title="Toggle file explorer"
          >
            <Code className="h-4 w-4" />
          </Button>
          
          {activeTab === "preview" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshPreview}
              className="h-8 w-8 p-0"
              title="Refresh preview"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={!sessionInfo}
                className="h-8 w-8 p-0"
                title="Push to GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Push to GitHub</DialogTitle>
                <DialogDescription>
                  Enter your GitHub username and repository name to push this project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="repo" className="text-right">
                    Repository
                  </Label>
                  <Input
                    id="repo"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handlePushToGithub}
                  disabled={isSubmitting || !githubUsername || !repoName}
                >
                  {isSubmitting ? "Pushing..." : "Push to GitHub"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs 
        defaultValue="code" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1"
      >
        <div className="px-3 pt-2 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="flex-1 p-0 h-full">
          <ScrollArea className="h-full">
            <pre className="p-4 text-sm font-mono h-full bg-black text-white">
              <code>{selectedFile.content}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 h-full">
          {projectFiles.length > 0 ? (
            <div className="h-full" key={refreshKey}>
              <Sandpack 
                files={projectFiles} 
                activeFile={selectedFile.path} 
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No files to preview yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeViewer;