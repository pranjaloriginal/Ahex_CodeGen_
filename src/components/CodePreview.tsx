
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Copy, Edit } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// interface CodePreviewProps {
//   code: string;
//   onEditCode: (code: string) => void;
// }

// const CodePreview: React.FC<CodePreviewProps> = ({ code, onEditCode }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editableCode, setEditableCode] = useState(code);
//   const { toast } = useToast();

//   const handleCopyToClipboard = () => {
//     navigator.clipboard.writeText(code);
//     toast({
//       description: "Code copied to clipboard",
//       duration: 2000,
//     });
//   };

//   const handleSaveEdit = () => {
//     onEditCode(editableCode);
//     setIsEditing(false);
//     toast({
//       description: "Code updated successfully",
//       duration: 2000,
//     });
//   };

//   return (
//     <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white">
//       <div className="p-3 border-b flex justify-between items-center bg-secondary/30">
//         <h3 className="text-sm font-medium">Code Preview</h3>
//         <div className="flex gap-2">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={handleCopyToClipboard}
//           >
//             <Copy className="h-4 w-4" />
//           </Button>
//           <Button 
//             variant={isEditing ? "default" : "ghost"} 
//             size="icon"
//             onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
//           >
//             <Edit className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="preview" className="flex-1 flex flex-col">
//         <div className="px-3 pt-2">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="preview">Preview</TabsTrigger>
//             <TabsTrigger value="code">Code</TabsTrigger>
//           </TabsList>
//         </div>
        
//         <div className="flex-1 overflow-hidden">
//           <TabsContent value="preview" className="h-full">
//             <div className="h-full p-4 overflow-y-auto">
//               <iframe
//                 title="Code Preview"
//                 srcDoc={`
//                   <!DOCTYPE html>
//                   <html>
//                     <head>
//                       <style>
//                         body { font-family: sans-serif; padding: 20px; }
//                         pre { background: #f4f4f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
//                       </style>
//                     </head>
//                     <body>
//                       <div id="root"></div>
//                       <script>
//                         // Basic renderer
//                         try {
//                           const code = ${JSON.stringify(code)};
//                           document.getElementById('root').innerHTML = code.includes('<') && code.includes('>') ? code : '<pre>' + code + '</pre>';
//                         } catch (e) {
//                           document.getElementById('root').innerHTML = '<p style="color: red;">Error rendering preview: ' + e.message + '</p>';
//                         }
//                       </script>
//                     </body>
//                   </html>
//                 `}
//                 className="w-full h-full border-0"
//                 sandbox="allow-scripts"
//               />
//             </div>
//           </TabsContent>
          
//           <TabsContent value="code" className="h-full">
//             {isEditing ? (
//               <div className="h-full p-2 flex flex-col">
//                 <textarea
//                   value={editableCode}
//                   onChange={(e) => setEditableCode(e.target.value)}
//                   className="flex-1 p-3 font-mono text-sm bg-secondary/20 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
//                   spellCheck={false}
//                 />
//                 <div className="flex justify-end gap-2 mt-2">
//                   <Button 
//                     variant="outline" 
//                     size="sm"
//                     onClick={() => {
//                       setEditableCode(code);
//                       setIsEditing(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     size="sm"
//                     onClick={handleSaveEdit}
//                   >
//                     Save Changes
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="h-full p-4 overflow-auto">
//                 <pre className="code-editor text-sm p-4 rounded-md bg-secondary/20 h-full whitespace-pre-wrap">
//                   {code}
//                 </pre>
//               </div>
//             )}
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// };

// export default CodePreview;



import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Edit, Download, Github, Play, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CodeFile {
  name: string;
  content: string;
  language?: string;
}

interface CodePreviewProps {
  code: string;
  files?: CodeFile[];
  onEditCode: (code: string) => void;
  onEditFiles?: (files: CodeFile[]) => void;
}

const CodePreview: React.FC<CodePreviewProps> = ({ 
  code, 
  files = [], 
  onEditCode,
  onEditFiles 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [isRunning, setIsRunning] = useState(true);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const { toast } = useToast();
  
  // Update editable code when props change
  useEffect(() => {
    setEditableCode(code);
  }, [code]);

  const handleCopyToClipboard = () => {
    if (activeTab === "files" && selectedFile) {
      const fileContent = files.find(f => f.name === selectedFile)?.content || '';
      navigator.clipboard.writeText(fileContent);
    } else {
      navigator.clipboard.writeText(code);
    }
    toast({
      description: "Code copied to clipboard",
      duration: 2000,
    });
  };

  const handleSaveEdit = () => {
    if (activeTab === "files" && selectedFile && onEditFiles) {
      const updatedFiles = files.map(f => 
        f.name === selectedFile ? { ...f, content: editableCode } : f
      );
      onEditFiles(updatedFiles);
    } else {
      onEditCode(editableCode);
    }
    setIsRunning(true); // Re-run code after save
    setIsEditing(false);
    toast({
      description: "Code updated successfully",
      duration: 2000,
    });
  };

  const handleDownloadProject = () => {
    if (!files || files.length === 0) {
      toast({
        variant: "destructive",
        description: "No project files to download",
        duration: 2000,
      });
      return;
    }

    // Create a zip file containing all project files
    import('jszip').then(({ default: JSZip }) => {
      const zip = new JSZip();
      
      // Add files to zip
      files.forEach(file => {
        const path = file.name;
        // Create needed directories in zip
        const dirs = path.split('/');
        if (dirs.length > 1) {
          dirs.pop(); // Remove filename
          const dirPath = dirs.join('/');
          zip.folder(dirPath);
        }
        zip.file(path, file.content);
      });

      // Add README.md if it doesn't exist
      if (!files.some(f => f.name === 'README.md')) {
        zip.file('README.md', `# Generated Project\nThis project was generated by AI.\n\n## Files\n${files.map(f => `- ${f.name}`).join('\n')}`);
      }
      
      // Generate zip file
      zip.generateAsync({ type: 'blob' }).then(content => {
        // Create download link
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-project.zip';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
        
        toast({
          description: "Project downloaded as ZIP file",
          duration: 2000,
        });
      });
    }).catch(err => {
      console.error("Failed to download project:", err);
      toast({
        variant: "destructive",
        description: "Failed to download project",
        duration: 2000,
      });
    });
  };

  const handlePushToGithub = async () => {
    if (!repoUrl || !githubToken || files.length === 0) {
      toast({
        variant: "destructive",
        description: "Repository URL and GitHub token are required",
        duration: 3000,
      });
      return;
    }

    toast({
      description: "Preparing to push to GitHub...",
      duration: 3000,
    });

    try {
      // This is a simplified example - in a real app, this would be handled by a backend service
      // For demo purposes, we're just showing a success message
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Project pushed to GitHub repository",
          duration: 5000,
        });
        setGithubDialogOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to push to GitHub:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to push to GitHub",
        duration: 3000,
      });
    }
  };

  // Get current code content based on selected file or single code
  const currentContent = selectedFile 
    ? files.find(f => f.name === selectedFile)?.content || '' 
    : code;

  // Helper to generate iframe HTML
  const generateIframeHtml = () => {
    if (!files || files.length === 0) {
      // Single file mode
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: sans-serif; margin: 0; padding: 0; }
              #root { padding: 20px; }
              pre { background: #f4f4f8; padding: 10px; border-radius: 4px; overflow-x: auto; }
            </style>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          </head>
          <body>
            <div id="root"></div>
            <script>
              // Basic renderer
              try {
                const code = ${JSON.stringify(code)};
                document.getElementById('root').innerHTML = code.includes('<') && code.includes('>') ? code : '<pre>' + code + '</pre>';
              } catch (e) {
                document.getElementById('root').innerHTML = '<p style="color: red;">Error rendering preview: ' + e.message + '</p>';
              }
            </script>
          </body>
        </html>
      `;
    } else {
      // Multi-file project mode - find index.html or create one
      const htmlFile = files.find(f => f.name === 'index.html') || files.find(f => f.name.endsWith('.html'));
      
      if (htmlFile) {
        // Use the existing HTML file
        return htmlFile.content;
      } else {
        // Create a basic HTML wrapper with scripts for all JS files
        const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx'));
        const cssFiles = files.filter(f => f.name.endsWith('.css'));
        
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Project Preview</title>
              <style>
                body { font-family: sans-serif; margin: 0; padding: 0; }
                #root { padding: 20px; }
              </style>
              ${cssFiles.map(f => `<style>${f.content}</style>`).join('\n')}
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              ${jsFiles.map(f => `<script type="text/babel" data-filename="${f.name}">${f.content}</script>`).join('\n')}
              <script type="text/babel">
                // Try to mount React component if one exists
                try {
                  if (typeof App !== 'undefined') {
                    ReactDOM.render(React.createElement(App), document.getElementById('root'));
                  }
                } catch (e) {
                  document.getElementById('root').innerHTML = '<p style="color: red;">Error rendering app: ' + e.message + '</p>';
                  console.error(e);
                }
              </script>
            </body>
          </html>
        `;
      }
    }
  };

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b flex justify-between items-center bg-secondary/30">
        <h3 className="text-sm font-medium">Code Preview</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyToClipboard}
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsRunning(prevState => !prevState)}
            title={isRunning ? "Stop preview" : "Run preview"}
          >
            <Play className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsRunning(true)}
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          {files && files.length > 0 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDownloadProject}
                title="Download project as ZIP"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setGithubDialogOpen(true)}
                title="Push to GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button 
            variant={isEditing ? "default" : "ghost"} 
            size="icon"
            onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
            title={isEditing ? "Save changes" : "Edit code"}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-3 pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {/* <TabsTrigger value="code">Code</TabsTrigger> */}
            <TabsTrigger value="files" disabled={!files || files.length === 0}>Project Files</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="preview" className="h-full">
            <div className="h-full p-4 overflow-y-auto">
              {isRunning ? (
                <iframe
                  title="Code Preview"
                  srcDoc={generateIframeHtml()}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Preview paused. Click the play button to resume.
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* <TabsContent value="code" className="h-full">
            {isEditing && activeTab === "code" ? (
              <div className="h-full p-2 flex flex-col">
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="flex-1 p-3 font-mono text-sm bg-secondary/20 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  spellCheck={false}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditableCode(code);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full p-4 overflow-auto">
                <pre className="code-editor text-sm p-4 rounded-md bg-secondary/20 h-full whitespace-pre-wrap">
                  {code}
                </pre>
              </div>
            )}
          </TabsContent> */}

          <TabsContent value="files" className="h-full">
            <div className="h-full flex">
              {/* File tree */}
              <div className="w-1/3 border-r p-2 overflow-auto">
                <h3 className="text-sm font-medium mb-2">Files</h3>
                <div className="space-y-1">
                  {files.map(file => (
                    <Button
                      key={file.name}
                      variant={selectedFile === file.name ? "default" : "ghost"}
                      className="w-full justify-start text-xs py-1 h-auto"
                      onClick={() => {
                        setSelectedFile(file.name);
                        setEditableCode(file.content);
                      }}
                    >
                      {file.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* File content */}
              <div className="w-2/3 flex flex-col">
                {selectedFile ? (
                  <>
                    <div className="p-2 border-b">
                      <h3 className="text-sm font-medium">{selectedFile}</h3>
                    </div>
                    {isEditing && activeTab === "files" ? (
                      <div className="flex-1 p-2 flex flex-col">
                        <textarea
                          value={editableCode}
                          onChange={(e) => setEditableCode(e.target.value)}
                          className="flex-1 p-3 font-mono text-sm bg-secondary/20 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                          spellCheck={false}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const original = files.find(f => f.name === selectedFile)?.content || '';
                              setEditableCode(original);
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={handleSaveEdit}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-2 overflow-auto">
                        <pre className="code-editor text-sm p-4 rounded-md bg-secondary/20 h-full whitespace-pre-wrap">
                          {currentContent}
                        </pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Select a file to view its content
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* GitHub Push Dialog */}
      <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Push to GitHub</DialogTitle>
            <DialogDescription>
              Push your project to a GitHub repository
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <Input 
                id="repo-url" 
                placeholder="https://github.com/username/repo" 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="github-token">GitHub Token</Label>
              <Input 
                id="github-token" 
                type="password" 
                placeholder="Your GitHub personal access token" 
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Create a token with 'repo' scope at GitHub Developer Settings.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handlePushToGithub}>
              <Github className="mr-2 h-4 w-4" />
              Push to GitHub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodePreview;