
// // import React from "react";
// // import { useAgentContext } from "../contexts/AgentContext";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Folder, File, FileCode, FileType, FileJson } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { Button } from "./ui/button";

// // const FileBrowser: React.FC = () => {
// //   const { projectFiles, selectedFile, setSelectedFile } = useAgentContext();

// //   // Group files by directory
// //   const fileTree = React.useMemo(() => {
// //     const tree: Record<string, string[]> = {
// //       "/": []
// //     };

// //     projectFiles.forEach(file => {
// //       const parts = file.path.split("/");
      
// //       // Handle root files
// //       if (parts.length === 1) {
// //         tree["/"].push(file.path);
// //         return;
// //       }
      
// //       // Handle files in directories
// //       const directory = parts.slice(0, -1).join("/");
// //       if (!tree[directory]) {
// //         tree[directory] = [];
        
// //         // Add parent directories if they don't exist
// //         let parentPath = "";
// //         for (const part of parts.slice(0, -1)) {
// //           const currentPath = parentPath ? `${parentPath}/${part}` : part;
// //           if (!tree[currentPath] && currentPath) {
// //             tree[currentPath] = [];
// //           }
// //           parentPath = currentPath;
// //         }
// //       }
      
// //       tree[directory].push(file.path);
// //     });
    
// //     return tree;
// //   }, [projectFiles]);

// //   // Get file icon based on extension
// //   const getFileIcon = (filename: string) => {
// //     const extension = filename.split('.').pop()?.toLowerCase();
    
// //     if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
// //       return <FileCode className="h-4 w-4 mr-2 text-yellow-500" />;
// //     } else if (['json'].includes(extension || '')) {
// //       return <FileJson className="h-4 w-4 mr-2 text-blue-500" />;
// //     } else if (['css', 'scss', 'less'].includes(extension || '')) {
// //       return <FileType className="h-4 w-4 mr-2 text-purple-500" />;
// //     } else if (['html'].includes(extension || '')) {
// //       return <FileCode className="h-4 w-4 mr-2 text-red-500" />;
// //     } else {
// //       return <File className="h-4 w-4 mr-2 text-gray-500" />;
// //     }
// //   };

// //   // Recursively render file tree
// //   const renderDirectory = (path: string, indent: number = 0) => {
// //     // If this is not a directory or doesn't exist, don't render anything
// //     if (!fileTree[path]) return null;
    
// //     // Sort files alphabetically
// //     const sortedFiles = [...fileTree[path]].sort();
    
// //     return sortedFiles.map(filePath => {
// //       // Check if this is a directory
// //       const isDirectory = Object.keys(fileTree).includes(filePath);
// //       const fileName = filePath.split('/').pop() || '';
      
// //       // Find the actual file object for files
// //       const fileObject = !isDirectory ? projectFiles.find(f => f.path === filePath) : null;
      
// //       const isSelected = selectedFile?.path === filePath;
      
// //       return (
// //         <div key={filePath} style={{ marginLeft: `${indent}px` }}>
// //           <Button
// //             variant="ghost"
// //             size="sm"
// //             className={cn(
// //               "w-full justify-start my-1 py-1 h-auto",
// //               isSelected && "bg-primary/10"
// //             )}
// //             onClick={() => {
// //               if (!isDirectory && fileObject) {
// //                 setSelectedFile(fileObject);
// //               }
// //             }}
// //           >
// //             <span className="flex items-center">
// //               {isDirectory ? (
// //                 <Folder className="h-4 w-4 mr-2 text-blue-500" />
// //               ) : (
// //                 getFileIcon(fileName)
// //               )}
// //               <span className="text-xs truncate">{fileName}</span>
// //             </span>
// //           </Button>
          
// //           {isDirectory && renderDirectory(filePath, indent + 12)}
// //         </div>
// //       );
// //     });
// //   };

// //   if (projectFiles.length === 0) {
// //     return (
// //       <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
// //         <div className="p-3 border-b bg-muted/20">
// //           <h3 className="text-sm font-medium">Project Files</h3>
// //         </div>
// //         <div className="flex-1 flex items-center justify-center p-4">
// //           <p className="text-sm text-muted-foreground text-center">
// //             No files generated yet. Start by describing your project in the chat.
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
// //       <div className="p-3 border-b bg-muted/20">
// //         <h3 className="text-sm font-medium">Project Files</h3>
// //         <p className="text-xs text-muted-foreground mt-1">
// //           {projectFiles.length} files
// //         </p>
// //       </div>
      
// //       <ScrollArea className="flex-1">
// //         <div className="p-2">
// //           {renderDirectory("/")}
// //         </div>
// //       </ScrollArea>
// //     </div>
// //   );
// // };

// // export default FileBrowser;


// import React, { useEffect } from "react";
// import { useAgentContext } from "../contexts/AgentContext";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Folder, File, FileCode, FileType, FileJson } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "./ui/button";

// const FileBrowser: React.FC = () => {
//   const { projectFiles, selectedFile, setSelectedFile, debug } = useAgentContext();

//   useEffect(() => {
//     // Debug info
//     console.log("Raw file list:", debug.rawFileList);
//     console.log("Project files:", projectFiles);
//   }, [debug.rawFileList, projectFiles]);

//   // Group files by directory
//   const fileTree = React.useMemo(() => {
//     const tree: Record<string, string[]> = {
//       "/": []
//     };

//     projectFiles.forEach(file => {
//       const parts = file.path.split("/");
      
//       // Handle root files
//       if (parts.length === 1) {
//         tree["/"].push(file.path);
//         return;
//       }
      
//       // Handle files in directories
//       const directory = parts.slice(0, -1).join("/");
//       if (!tree[directory]) {
//         tree[directory] = [];
        
//         // Add parent directories if they don't exist
//         let parentPath = "";
//         for (const part of parts.slice(0, -1)) {
//           const currentPath = parentPath ? `${parentPath}/${part}` : part;
//           if (!tree[currentPath] && currentPath) {
//             tree[currentPath] = [];
//           }
//           parentPath = currentPath;
//         }
//       }
      
//       tree[directory].push(file.path);
//     });
    
//     return tree;
//   }, [projectFiles]);

//   // Get file icon based on extension
//   const getFileIcon = (filename: string) => {
//     const extension = filename.split('.').pop()?.toLowerCase();
    
//     if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
//       return <FileCode className="h-4 w-4 mr-2 text-yellow-500" />;
//     } else if (['json'].includes(extension || '')) {
//       return <FileJson className="h-4 w-4 mr-2 text-blue-500" />;
//     } else if (['css', 'scss', 'less'].includes(extension || '')) {
//       return <FileType className="h-4 w-4 mr-2 text-purple-500" />;
//     } else if (['html', 'htm'].includes(extension || '')) {
//       return <FileCode className="h-4 w-4 mr-2 text-red-500" />;
//     } else {
//       return <File className="h-4 w-4 mr-2 text-gray-500" />;
//     }
//   };

//   // Recursively render file tree
//   const renderDirectory = (path: string, indent: number = 0) => {
//     // If this is not a directory or doesn't exist, don't render anything
//     if (!fileTree[path]) return null;
    
//     // Sort files alphabetically
//     const sortedFiles = [...fileTree[path]].sort();
    
//     return sortedFiles.map(filePath => {
//       // Check if this is a directory
//       const isDirectory = Object.keys(fileTree).includes(filePath);
//       const fileName = filePath.split('/').pop() || '';
      
//       // Find the actual file object for files
//       const fileObject = !isDirectory ? projectFiles.find(f => f.path === filePath) : null;
      
//       const isSelected = selectedFile?.path === filePath;
      
//       return (
//         <div key={filePath} style={{ marginLeft: `${indent}px` }}>
//           <Button
//             variant="ghost"
//             size="sm"
//             className={cn(
//               "w-full justify-start my-1 py-1 h-auto",
//               isSelected && "bg-primary/10"
//             )}
//             onClick={() => {
//               if (!isDirectory && fileObject) {
//                 setSelectedFile(fileObject);
//               }
//             }}
//           >
//             <span className="flex items-center">
//               {isDirectory ? (
//                 <Folder className="h-4 w-4 mr-2 text-blue-500" />
//               ) : (
//                 getFileIcon(fileName)
//               )}
//               <span className="text-xs truncate">{fileName}</span>
//             </span>
//           </Button>
          
//           {isDirectory && renderDirectory(filePath, indent + 12)}
//         </div>
//       );
//     });
//   };

//   if (projectFiles.length === 0) {
//     return (
//       <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
//         <div className="p-3 border-b bg-muted/20">
//           <h3 className="text-sm font-medium">Project Files</h3>
//         </div>
//         <div className="flex-1 flex items-center justify-center p-4">
//           <p className="text-sm text-muted-foreground text-center">
//             No files generated yet. Start by describing your project in the chat.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
//       <div className="p-3 border-b bg-muted/20">
//         <h3 className="text-sm font-medium">Project Files</h3>
//         <p className="text-xs text-muted-foreground mt-1">
//           {projectFiles.length} files
//         </p>
//       </div>
      
//       <ScrollArea className="flex-1">
//         <div className="p-2">
//           {renderDirectory("/")}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// };

// export default FileBrowser;
"use client"

import React, { useEffect } from "react"
import { useAgentContext } from "../contexts/AgentContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, File, FileCode, FileType, FileJson } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const FileBrowser: React.FC = () => {
  const { projectFiles, selectedFile, setSelectedFile, debug } = useAgentContext()

  useEffect(() => {
    // Debug info
    console.log("Raw file list:", debug.rawFileList)
    console.log("Project files:", projectFiles)
  }, [debug.rawFileList, projectFiles])

  // Group files by directory
  const fileTree = React.useMemo(() => {
    const tree: Record<string, string[]> = {
      "/": [],
    }

    // First, process the raw file list if available
    if (debug.rawFileList && debug.rawFileList.length > 0) {
      debug.rawFileList.forEach((filePath) => {
        const parts = filePath.split("/")

        // Handle root files
        if (parts.length === 1) {
          tree["/"].push(filePath)
          return
        }

        // Create directory entries for each path segment
        let currentPath = ""
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i]
          const nextPath = currentPath ? `${currentPath}/${part}` : part

          if (!tree[nextPath]) {
            tree[nextPath] = []

            // Add this directory to its parent
            const parentPath = i === 0 ? "/" : currentPath
            if (tree[parentPath] && !tree[parentPath].includes(nextPath)) {
              tree[parentPath].push(nextPath)
            }
          }

          currentPath = nextPath
        }

        // Add the file to its directory
        const dirPath = parts.length > 1 ? parts.slice(0, -1).join("/") : "/"
        if (!tree[dirPath].includes(filePath)) {
          tree[dirPath].push(filePath)
        }
      })
    } else {
      // Fallback to using projectFiles if rawFileList is not available
      projectFiles.forEach((file) => {
        const parts = file.path.split("/")

        // Handle root files
        if (parts.length === 1) {
          tree["/"].push(file.path)
          return
        }

        // Create directory entries for each path segment
        let currentPath = ""
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i]
          const nextPath = currentPath ? `${currentPath}/${part}` : part

          if (!tree[nextPath]) {
            tree[nextPath] = []

            // Add this directory to its parent
            const parentPath = i === 0 ? "/" : currentPath
            if (tree[parentPath] && !tree[parentPath].includes(nextPath)) {
              tree[parentPath].push(nextPath)
            }
          }

          currentPath = nextPath
        }

        // Add the file to its directory
        const dirPath = parts.length > 1 ? parts.slice(0, -1).join("/") : "/"
        if (!tree[dirPath].includes(file.path)) {
          tree[dirPath].push(file.path)
        }
      })
    }

    return tree
  }, [projectFiles, debug.rawFileList])

  // Get file icon based on extension
  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase()

    if (["js", "jsx", "ts", "tsx"].includes(extension || "")) {
      return <FileCode className="h-4 w-4 mr-2 text-yellow-500" />
    } else if (["json"].includes(extension || "")) {
      return <FileJson className="h-4 w-4 mr-2 text-blue-500" />
    } else if (["css", "scss", "less"].includes(extension || "")) {
      return <FileType className="h-4 w-4 mr-2 text-purple-500" />
    } else if (["html", "htm"].includes(extension || "")) {
      return <FileCode className="h-4 w-4 mr-2 text-red-500" />
    } else {
      return <File className="h-4 w-4 mr-2 text-gray-500" />
    }
  }

  // Check if a path is a directory in our tree
  const isDirectory = (path: string) => {
    return Object.keys(fileTree).includes(path)
  }

  // Recursively render file tree
  const renderDirectory = (path: string, indent = 0) => {
    // If this is not a directory or doesn't exist, don't render anything
    if (!fileTree[path]) return null

    // Sort entries: directories first, then files, both alphabetically
    const sortedEntries = [...fileTree[path]].sort((a, b) => {
      const aIsDir = isDirectory(a)
      const bIsDir = isDirectory(b)

      // If both are directories or both are files, sort alphabetically
      if (aIsDir === bIsDir) {
        return a.localeCompare(b)
      }

      // Directories come before files
      return aIsDir ? -1 : 1
    })

    return sortedEntries.map((entryPath) => {
      const isDir = isDirectory(entryPath)
      const fileName = entryPath.split("/").pop() || ""

      // Find the actual file object for files
      const fileObject = !isDir ? projectFiles.find((f) => f.path === entryPath) : null

      const isSelected = selectedFile?.path === entryPath

      return (
        <div key={entryPath} style={{ marginLeft: `${indent}px` }}>
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full justify-start my-1 py-1 h-auto", isSelected && "bg-primary/10")}
            onClick={() => {
              if (!isDir && fileObject) {
                setSelectedFile(fileObject)
              }
            }}
          >
            <span className="flex items-center">
              {isDir ? <Folder className="h-4 w-4 mr-2 text-blue-500" /> : getFileIcon(fileName)}
              <span className="text-xs truncate">{fileName}</span>
            </span>
          </Button>

          {isDir && renderDirectory(entryPath, indent + 12)}
        </div>
      )
    })
  }

  // Handle case when no files are available
  if (projectFiles.length === 0 && (!debug.rawFileList || debug.rawFileList.length === 0)) {
    return (
      <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
        <div className="p-3 border-b bg-muted/20">
          <h3 className="text-sm font-medium">Project Files</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            No files generated yet. Start by describing your project in the chat.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      <div className="p-3 border-b bg-muted/20">
        <h3 className="text-sm font-medium">Project Files</h3>
        <p className="text-xs text-muted-foreground mt-1">{debug.rawFileList?.length || projectFiles.length} files</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">{renderDirectory("/")}</div>
      </ScrollArea>
    </div>
  )
}

export default FileBrowser
