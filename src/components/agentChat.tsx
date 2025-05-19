
// // import React, { useState, useRef, useEffect } from 'react';
// // import { useAgentContext } from "../contexts/AgentContext";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Avatar } from "@/components/ui/avatar";
// // import { Send } from "lucide-react";
// // import { useToast } from "@/components/ui/use-toast";
// // import  { startSession, updateCode, getFileContent, listFiles }  from "../services/agentService";

// // const AgentChat: React.FC = () => {
// //   const { 
// //     messages, 
// //     addMessage, 
// //     sessionInfo, 
// //     setSessionInfo, 
// //     loadingState, 
// //     setLoadingState,
// //     projectFiles,
// //     setProjectFiles
// //   } = useAgentContext();
// //   const [input, setInput] = useState('');
// //   const scrollAreaRef = useRef<HTMLDivElement>(null);
// //   const { toast } = useToast();

// //   useEffect(() => {
// //     // Scroll to bottom when messages change
// //     if (scrollAreaRef.current) {
// //       const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
// //       if (scrollContainer) {
// //         scrollContainer.scrollTop = scrollContainer.scrollHeight;
// //       }
// //     }
// //   }, [messages]);

// //   const handleStartSession = async (prompt: string) => {
// //     try {
// //       setLoadingState({ initializing: true });
      
// //       addMessage({
// //         role: 'user',
// //         content: prompt,
// //       });

// //       // Call the extractor, planner, and code generator
// //       const sessionData = await startSession(prompt);
// //       setSessionInfo(sessionData);

// //       // Get the list of generated files
// //       const files = await Promise.all(
// //         sessionData.fileMap.map(async (filePath) => {
// //           const fileData = await getFileContent(sessionData.sessionId, filePath);
          
// //           // Determine language based on file extension
// //           const extension = filePath.split('.').pop() || '';
// //           let language = 'text';
          
// //           if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) language = 'javascript';
// //           else if (['py'].includes(extension)) language = 'python';
// //           else if (['html'].includes(extension)) language = 'html';
// //           else if (['css'].includes(extension)) language = 'css';
// //           else if (['json'].includes(extension)) language = 'json';
          
// //           return {
// //             name: filePath.split('/').pop() || '',
// //             path: filePath,
// //             content: fileData.content,
// //             language
// //           };
// //         })
// //       );
      
// //       setProjectFiles(files);

// //       addMessage({
// //         role: 'assistant',
// //         content: `I've generated the initial code for your project with ${files.length} files. You can view them in the file browser and make updates by providing additional instructions.`,
// //       });

// //     } catch (error) {
// //       console.error('Error starting session:', error);
// //       toast({
// //         title: "Error",
// //         description: error instanceof Error ? error.message : "Failed to generate code",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoadingState({ initializing: false });
// //     }
// //   };

// //   const handleUpdateCode = async (instruction: string) => {
// //     if (!sessionInfo) {
// //       toast({
// //         title: "Error",
// //         description: "No active session. Please start a new session first.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     try {
// //       setLoadingState({ updating: true });
      
// //       addMessage({
// //         role: 'user',
// //         content: instruction,
// //       });

// //       // Call the updater agent
// //       const result = await updateCode(sessionInfo.sessionId, instruction);

// //       // Fetch the updated files
// //       const updatedProjectFiles = [...projectFiles];
      
// //       for (const filePath of result.updatedFiles) {
// //         const fileData = await getFileContent(sessionInfo.sessionId, filePath);
        
// //         // Check if file already exists in our list
// //         const existingFileIndex = updatedProjectFiles.findIndex(f => f.path === filePath);
        
// //         const extension = filePath.split('.').pop() || '';
// //         let language = 'text';
        
// //         if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) language = 'javascript';
// //         else if (['py'].includes(extension)) language = 'python';
// //         else if (['html'].includes(extension)) language = 'html';
// //         else if (['css'].includes(extension)) language = 'css';
// //         else if (['json'].includes(extension)) language = 'json';
        
// //         const updatedFile = {
// //           name: filePath.split('/').pop() || '',
// //           path: filePath,
// //           content: fileData.content,
// //           language
// //         };
        
// //         if (existingFileIndex >= 0) {
// //           updatedProjectFiles[existingFileIndex] = updatedFile;
// //         } else {
// //           updatedProjectFiles.push(updatedFile);
// //         }
// //       }
      
// //       setProjectFiles(updatedProjectFiles);

// //       addMessage({
// //         role: 'assistant',
// //         content: `I've updated the code based on your instructions. ${result.updatedFiles.length} files were modified.`,
// //       });

// //     } catch (error) {
// //       console.error('Error updating code:', error);
// //       toast({
// //         title: "Error",
// //         description: error instanceof Error ? error.message : "Failed to update code",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoadingState({ updating: false });
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!input.trim()) return;
    
// //     const userMessage = input.trim();
// //     setInput('');
    
// //     if (!sessionInfo) {
// //       await handleStartSession(userMessage);
// //     } else {
// //       await handleUpdateCode(userMessage);
// //     }
// //   };

// //   // Example prompts
// //   const examplePrompts = [
// //     "Create a React to-do list app with local storage",
// //     "Build a weather dashboard with API integration",
// //     "Generate a portfolio website template",
// //     "Make a markdown editor with preview"
// //   ];

// //   return (
// //     <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
// //       <div className="p-3 border-b flex justify-between items-center bg-muted/20">
// //         <h3 className="text-sm font-medium">AI Code Generator</h3>
// //         <div className="text-xs text-muted-foreground">
// //           {sessionInfo && `Session: ${sessionInfo.sessionId.substring(0, 8)}...`}
// //         </div>
// //       </div>
      
// //       <ScrollArea className="flex-1" ref={scrollAreaRef}>
// //         <div className="p-4 space-y-4">
// //           {messages.map((message) => (
// //             <div 
// //               key={message.id} 
// //               className={`chat-message ${message.role === 'user' ? 'pl-0' : 'pl-6'} animate-fade-in`}
// //             >
// //               <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
// //                 <Avatar className={`h-8 w-8 ${
// //                   message.role === 'assistant' ? 'bg-purple-500' : 
// //                   message.role === 'system' ? 'bg-blue-500' : 'bg-gray-200'
// //                 }`}>
// //                   <div className="flex h-full items-center justify-center text-xs font-semibold">
// //                     {message.role === 'assistant' ? 'AI' : 
// //                      message.role === 'system' ? 'S' : 'You'}
// //                   </div>
// //                 </Avatar>
                
// //                 <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
// //                   <div className={`inline-block max-w-[85%] rounded-lg p-3 ${
// //                     message.role === 'user' 
// //                       ? 'bg-primary text-primary-foreground' 
// //                       : message.role === 'system'
// //                       ? 'bg-blue-100 text-foreground'
// //                       : 'bg-secondary text-foreground'
// //                   }`}>
// //                     <p className="text-sm whitespace-pre-wrap">{message.content}</p>
// //                   </div>
// //                   <p className="text-xs text-muted-foreground">
// //                     {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
          
// //           {(loadingState.initializing || loadingState.updating) && (
// //             <div className="chat-message pl-6 animate-fade-in">
// //               <div className="flex gap-3">
// //                 <Avatar className="h-8 w-8 bg-purple-500">
// //                   <div className="flex h-full items-center justify-center text-xs font-semibold">
// //                     AI
// //                   </div>
// //                 </Avatar>
                
// //                 <div className="flex-1 space-y-1">
// //                   <div className="inline-block rounded-lg p-3 bg-secondary">
// //                     <div className="flex space-x-2">
// //                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
// //                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
// //                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
// //                     </div>
// //                     <p className="text-xs mt-2 text-muted-foreground">
// //                       {loadingState.initializing ? "Initializing project..." : "Updating code..."}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </ScrollArea>
      
// //       {/* Example prompts */}
// //       {!sessionInfo && (
// //         <div className="px-4 py-2 border-t">
// //           <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
// //           <div className="flex flex-wrap gap-2">
// //             {examplePrompts.map((prompt) => (
// //               <Button
// //                 key={prompt}
// //                 variant="outline"
// //                 size="sm"
// //                 className="text-xs"
// //                 onClick={() => setInput(prompt)}
// //               >
// //                 {prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}
// //               </Button>
// //             ))}
// //           </div>
// //         </div>
// //       )}
      
// //       <form onSubmit={handleSubmit} className="p-3 border-t">
// //         <div className="flex gap-2">
// //           <Textarea 
// //             placeholder={!sessionInfo ? "Describe the application you want to build..." : "Provide instructions for code updates..."}
// //             value={input} 
// //             onChange={(e) => setInput(e.target.value)}
// //             className="min-h-[60px] resize-none"
// //             disabled={loadingState.initializing || loadingState.updating}
// //             onKeyDown={(e) => {
// //               if (e.key === 'Enter' && !e.shiftKey) {
// //                 e.preventDefault();
// //                 handleSubmit(e);
// //               }
// //             }}
// //           />
// //           <Button 
// //             type="submit" 
// //             size="icon" 
// //             disabled={!input.trim() || loadingState.initializing || loadingState.updating}
// //             className="h-[60px] w-[60px]"
// //           >
// //             <Send className="h-5 w-5" />
// //           </Button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default AgentChat;



// import React, { useState, useRef, useEffect } from 'react';
// import { useAgentContext } from "../contexts/AgentContext";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar } from "@/components/ui/avatar";
// import { Send } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { startSession, updateCode, getFileContent, listFiles } from "../services/agentService";

// const AgentChat: React.FC = () => {
//   const { 
//     messages, 
//     addMessage, 
//     sessionInfo, 
//     setSessionInfo, 
//     loadingState, 
//     setLoadingState,
//     projectFiles,
//     setProjectFiles
//   } = useAgentContext();
//   const [input, setInput] = useState('');
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     if (scrollAreaRef.current) {
//       const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
//       if (scrollContainer) {
//         scrollContainer.scrollTop = scrollContainer.scrollHeight;
//       }
//     }
//   }, [messages]);

//   const handleStartSession = async (prompt: string) => {
//     try {
//       setLoadingState({ initializing: true });
      
//       addMessage({
//         role: 'user',
//         content: prompt,
//       });

//       // Call the requirements extractor, planner, and code generator
//       const sessionData = await startSession(prompt);
//       setSessionInfo(sessionData);

//       // Add the requirements and tasks as system messages
//       if (sessionData.requirements) {
//         addMessage({
//           role: 'system',
//           content: `📋 Requirements:\n${sessionData.requirements}`,
//         });
//       }

//       if (sessionData.tasks) {
//         addMessage({
//           role: 'system',
//           content: `✅ Tasks:\n${sessionData.tasks}`,
//         });
//       }

//       // Get the list of generated files
//       const files = await Promise.all(
//         sessionData.fileMap.map(async (filePath) => {
//           const fileData = await getFileContent(sessionData.sessionId, filePath);
          
//           // Determine language based on file extension
//           const extension = filePath.split('.').pop() || '';
//           let language = 'text';
          
//           if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) language = 'javascript';
//           else if (['py'].includes(extension)) language = 'python';
//           else if (['html'].includes(extension)) language = 'html';
//           else if (['css'].includes(extension)) language = 'css';
//           else if (['json'].includes(extension)) language = 'json';
          
//           return {
//             name: filePath.split('/').pop() || '',
//             path: filePath,
//             content: fileData.content,
//             language
//           };
//         })
//       );
      
//       setProjectFiles(files);

//       addMessage({
//         role: 'assistant',
//         content: `I've generated the initial code for your project with ${files.length} files. You can view them in the file browser and make updates by providing additional instructions.`,
//       });

//     } catch (error) {
//       console.error('Error starting session:', error);
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to generate code",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingState({ initializing: false });
//     }
//   };

//   const handleUpdateCode = async (instruction: string) => {
//     if (!sessionInfo) {
//       toast({
//         title: "Error",
//         description: "No active session. Please start a new session first.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoadingState({ updating: true });
      
//       addMessage({
//         role: 'user',
//         content: instruction,
//       });

//       // Call the updater agent
//       const result = await updateCode(sessionInfo.sessionId, instruction);

//       // Fetch the updated files
//       const updatedProjectFiles = [...projectFiles];
      
//       for (const filePath of result.updatedFiles) {
//         const fileData = await getFileContent(sessionInfo.sessionId, filePath);
        
//         // Check if file already exists in our list
//         const existingFileIndex = updatedProjectFiles.findIndex(f => f.path === filePath);
        
//         const extension = filePath.split('.').pop() || '';
//         let language = 'text';
        
//         if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) language = 'javascript';
//         else if (['py'].includes(extension)) language = 'python';
//         else if (['html'].includes(extension)) language = 'html';
//         else if (['css'].includes(extension)) language = 'css';
//         else if (['json'].includes(extension)) language = 'json';
        
//         const updatedFile = {
//           name: filePath.split('/').pop() || '',
//           path: filePath,
//           content: fileData.content,
//           language
//         };
        
//         if (existingFileIndex >= 0) {
//           updatedProjectFiles[existingFileIndex] = updatedFile;
//         } else {
//           updatedProjectFiles.push(updatedFile);
//         }
//       }
      
//       setProjectFiles(updatedProjectFiles);

//       addMessage({
//         role: 'assistant',
//         content: `I've updated the code based on your instructions. ${result.updatedFiles.length} files were modified.`,
//       });

//     } catch (error) {
//       console.error('Error updating code:', error);
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to update code",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingState({ updating: false });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!input.trim()) return;
    
//     const userMessage = input.trim();
//     setInput('');
    
//     if (!sessionInfo) {
//       await handleStartSession(userMessage);
//     } else {
//       await handleUpdateCode(userMessage);
//     }
//   };

//   // Example prompts
//   const examplePrompts = [
//     "Create a React to-do list app with local storage",
//     "Build a weather dashboard with API integration",
//     "Generate a portfolio website template",
//     "Make a markdown editor with preview"
//   ];

//   return (
//     <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
//       <div className="p-3 border-b flex justify-between items-center bg-muted/20">
//         <h3 className="text-sm font-medium">AI Code Generator</h3>
//         <div className="text-xs text-muted-foreground">
//           {sessionInfo && `Session: ${sessionInfo.sessionId.substring(0, 8)}...`}
//         </div>
//       </div>
      
//       <ScrollArea className="flex-1" ref={scrollAreaRef}>
//         <div className="p-4 space-y-4">
//           {messages.map((message) => (
//             <div 
//               key={message.id} 
//               className={`chat-message ${message.role === 'user' ? 'pl-0' : 'pl-6'} animate-fade-in`}
//             >
//               <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
//                 <Avatar className={`h-8 w-8 ${
//                   message.role === 'assistant' ? 'bg-purple-500' : 
//                   message.role === 'system' ? 'bg-blue-500' : 'bg-gray-200'
//                 }`}>
//                   <div className="flex h-full items-center justify-center text-xs font-semibold">
//                     {message.role === 'assistant' ? 'AI' : 
//                      message.role === 'system' ? 'S' : 'You'}
//                   </div>
//                 </Avatar>
                
//                 <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
//                   <div className={`inline-block max-w-[85%] rounded-lg p-3 ${
//                     message.role === 'user' 
//                       ? 'bg-primary text-primary-foreground' 
//                       : message.role === 'system'
//                       ? 'bg-blue-100 text-foreground'
//                       : 'bg-secondary text-foreground'
//                   }`}>
//                     <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {(loadingState.initializing || loadingState.updating) && (
//             <div className="chat-message pl-6 animate-fade-in">
//               <div className="flex gap-3">
//                 <Avatar className="h-8 w-8 bg-purple-500">
//                   <div className="flex h-full items-center justify-center text-xs font-semibold">
//                     AI
//                   </div>
//                 </Avatar>
                
//                 <div className="flex-1 space-y-1">
//                   <div className="inline-block rounded-lg p-3 bg-secondary">
//                     <div className="flex space-x-2">
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                     </div>
//                     <p className="text-xs mt-2 text-muted-foreground">
//                       {loadingState.initializing ? "Extracting requirements, planning tasks, and generating code..." : "Updating code..."}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>
      
//       {/* Example prompts */}
//       {!sessionInfo && (
//         <div className="px-4 py-2 border-t">
//           <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
//           <div className="flex flex-wrap gap-2">
//             {examplePrompts.map((prompt) => (
//               <Button
//                 key={prompt}
//                 variant="outline"
//                 size="sm"
//                 className="text-xs"
//                 onClick={() => setInput(prompt)}
//               >
//                 {prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}
//               </Button>
//             ))}
//           </div>
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="p-3 border-t">
//         <div className="flex gap-2">
//           <Textarea 
//             placeholder={!sessionInfo ? "Describe the application you want to build..." : "Provide instructions for code updates..."}
//             value={input} 
//             onChange={(e) => setInput(e.target.value)}
//             className="min-h-[60px] resize-none"
//             disabled={loadingState.initializing || loadingState.updating}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSubmit(e);
//               }
//             }}
//           />
//           <Button 
//             type="submit" 
//             size="icon" 
//             disabled={!input.trim() || loadingState.initializing || loadingState.updating}
//             className="h-[60px] w-[60px]"
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AgentChat;

// import React, { useState, useRef, useEffect } from 'react';
// import { useAgentContext } from "../contexts/AgentContext";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar } from "@/components/ui/avatar";
// import { Send } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { startSession, updateCode, getFileContent, listFiles } from "../services/agentService";

// const AgentChat: React.FC = () => {
//   const { 
//     messages, 
//     addMessage, 
//     sessionInfo, 
//     setSessionInfo, 
//     loadingState, 
//     setLoadingState,
//     projectFiles,
//     setProjectFiles,
//     debug
//   } = useAgentContext();
//   const [input, setInput] = useState('');
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     if (scrollAreaRef.current) {
//       const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
//       if (scrollContainer) {
//         scrollContainer.scrollTop = scrollContainer.scrollHeight;
//       }
//     }
//   }, [messages]);

//   const handleStartSession = async (prompt: string) => {
//     try {
//       setLoadingState({ initializing: true });
      
//       addMessage({
//         role: 'user',
//         content: prompt,
//       });

//       // Call the requirements extractor, planner, and code generator
//       const sessionData = await startSession(prompt);
//       setSessionInfo(sessionData);
      
//       // Store raw file list for debugging
//       if (sessionData.fileMap) {
//         debug.setRawFileList(sessionData.fileMap);
//       }

//       // Add the requirements and tasks as system messages
//       if (sessionData.requirements) {
//         addMessage({
//           role: 'system',
//           content: `📋 Requirements:\n${sessionData.requirements}`,
//         });
//       }

//       if (sessionData.tasks) {
//         addMessage({
//           role: 'system',
//           content: `✅ Tasks:\n${sessionData.tasks}`,
//         });
//       }

//       // Get the list of generated files
//       if (sessionData.fileMap && Array.isArray(sessionData.fileMap)) {
//         const files = await Promise.all(
//           sessionData.fileMap.map(async (filePath) => {
//             try {
//               const fileData = await getFileContent(sessionData.sessionId, filePath);
              
//               // Determine language based on file extension
//               const extension = filePath.split('.').pop()?.toLowerCase() || '';
//               let language = 'text';
              
//               if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) language = 'javascript';
//               else if (['py'].includes(extension)) language = 'python';
//               else if (['html'].includes(extension)) language = 'html';
//               else if (['css'].includes(extension)) language = 'css';
//               else if (['json'].includes(extension)) language = 'json';
              
//               return {
//                 name: filePath.split('/').pop() || '',
//                 path: filePath,
//                 content: fileData.content,
//                 language
//               };
//             } catch (error) {
//               console.error(`Error fetching file ${filePath}:`, error);
//               return {
//                 name: filePath.split('/').pop() || '',
//                 path: filePath,
//                 content: `Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`,
//                 language: 'text'
//               };
//             }
//           })
//         );
        
//         console.log("Generated files:", files);
//         setProjectFiles(files);

//         addMessage({
//           role: 'assistant',
//           content: `I've generated the initial code for your project with ${files.length} files. You can view them in the file browser and make updates by providing additional instructions.`,
//         });
//       } else {
//         console.error("No fileMap in session data or fileMap is not an array:", sessionData);
//         addMessage({
//           role: 'assistant',
//           content: "I've generated the initial code, but there was an issue loading the files. Please try again or check the console for errors.",
//         });
//       }

//     } catch (error) {
//       console.error('Error starting session:', error);
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to generate code",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingState({ initializing: false });
//     }
//   };

//   const handleUpdateCode = async (instruction: string) => {
//     if (!sessionInfo) {
//       toast({
//         title: "Error",
//         description: "No active session. Please start a new session first.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setLoadingState({ updating: true });
      
//       addMessage({
//         role: 'user',
//         content: instruction,
//       });

//       // Call the updater agent
//       const result = await updateCode(sessionInfo.sessionId, instruction);

//       // Fetch the updated files
//       const updatedProjectFiles = [...projectFiles];
      
//       for (const filePath of result.updatedFiles) {
//         try {
//           const fileData = await getFileContent(sessionInfo.sessionId, filePath);
          
//           // Check if file already exists in our list
//           const existingFileIndex = updatedProjectFiles.findIndex(f => f.path === filePath);
          
//           const extension = filePath.split('.').pop()?.toLowerCase() || '';
//           let language = 'text';
          
//           if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) language = 'javascript';
//           else if (['py'].includes(extension)) language = 'python';
//           else if (['html'].includes(extension)) language = 'html';
//           else if (['css'].includes(extension)) language = 'css';
//           else if (['json'].includes(extension)) language = 'json';
          
//           const updatedFile = {
//             name: filePath.split('/').pop() || '',
//             path: filePath,
//             content: fileData.content,
//             language
//           };
          
//           if (existingFileIndex >= 0) {
//             updatedProjectFiles[existingFileIndex] = updatedFile;
//           } else {
//             updatedProjectFiles.push(updatedFile);
//           }
//         } catch (error) {
//           console.error(`Error updating file ${filePath}:`, error);
//         }
//       }
      
//       // Update the raw file list for debugging
//       const allFilePaths = updatedProjectFiles.map(file => file.path);
//       debug.setRawFileList(allFilePaths);
      
//       setProjectFiles(updatedProjectFiles);

//       addMessage({
//         role: 'assistant',
//         content: `I've updated the code based on your instructions. ${result.updatedFiles.length} files were modified.`,
//       });

//     } catch (error) {
//       console.error('Error updating code:', error);
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to update code",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingState({ updating: false });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!input.trim()) return;
    
//     const userMessage = input.trim();
//     setInput('');
    
//     if (!sessionInfo) {
//       await handleStartSession(userMessage);
//     } else {
//       await handleUpdateCode(userMessage);
//     }
//   };

//   // Example prompts
//   const examplePrompts = [
//     "Create a React to-do list app with local storage",
//     "Build a weather dashboard with API integration",
//     "Generate a portfolio website template",
//     "Make a markdown editor with preview"
//   ];

//   return (
//     <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
//       <div className="p-3 border-b flex justify-between items-center bg-muted/20">
//         <h3 className="text-sm font-medium">AI Code Generator</h3>
//         <div className="text-xs text-muted-foreground">
//           {sessionInfo && `Session: ${sessionInfo.sessionId.substring(0, 8)}...`}
//         </div>
//       </div>
      
//       <ScrollArea className="flex-1" ref={scrollAreaRef}>
//         <div className="p-4 space-y-4">
//           {messages.map((message) => (
//             <div 
//               key={message.id} 
//               className={`chat-message ${message.role === 'user' ? 'pl-0' : 'pl-6'} animate-fade-in`}
//             >
//               <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
//                 <Avatar className={`h-8 w-8 ${
//                   message.role === 'assistant' ? 'bg-purple-500' : 
//                   message.role === 'system' ? 'bg-blue-500' : 'bg-gray-200'
//                 }`}>
//                   <div className="flex h-full items-center justify-center text-xs font-semibold">
//                     {message.role === 'assistant' ? 'AI' : 
//                      message.role === 'system' ? 'S' : 'You'}
//                   </div>
//                 </Avatar>
                
//                 <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
//                   <div className={`inline-block max-w-[85%] rounded-lg p-3 ${
//                     message.role === 'user' 
//                       ? 'bg-primary text-primary-foreground' 
//                       : message.role === 'system'
//                       ? 'bg-blue-100 text-foreground'
//                       : 'bg-secondary text-foreground'
//                   }`}>
//                     <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {(loadingState.initializing || loadingState.updating) && (
//             <div className="chat-message pl-6 animate-fade-in">
//               <div className="flex gap-3">
//                 <Avatar className="h-8 w-8 bg-purple-500">
//                   <div className="flex h-full items-center justify-center text-xs font-semibold">
//                     AI
//                   </div>
//                 </Avatar>
                
//                 <div className="flex-1 space-y-1">
//                   <div className="inline-block rounded-lg p-3 bg-secondary">
//                     <div className="flex space-x-2">
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                     </div>
//                     <p className="text-xs mt-2 text-muted-foreground">
//                       {loadingState.initializing ? "Extracting requirements, planning tasks, and generating code..." : "Updating code..."}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>
      
//       {/* Example prompts */}
//       {!sessionInfo && (
//         <div className="px-4 py-2 border-t">
//           <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
//           <div className="flex flex-wrap gap-2">
//             {examplePrompts.map((prompt) => (
//               <Button
//                 key={prompt}
//                 variant="outline"
//                 size="sm"
//                 className="text-xs"
//                 onClick={() => setInput(prompt)}
//               >
//                 {prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt}
//               </Button>
//             ))}
//           </div>
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="p-3 border-t">
//         <div className="flex gap-2">
//           <Textarea 
//             placeholder={!sessionInfo ? "Describe the application you want to build..." : "Provide instructions for code updates..."}
//             value={input} 
//             onChange={(e) => setInput(e.target.value)}
//             className="min-h-[60px] resize-none"
//             disabled={loadingState.initializing || loadingState.updating}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSubmit(e);
//               }
//             }}
//           />
//           <Button 
//             type="submit" 
//             size="icon" 
//             disabled={!input.trim() || loadingState.initializing || loadingState.updating}
//             className="h-[60px] w-[60px]"
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AgentChat;
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAgentContext } from "../contexts/AgentContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { startSession, updateCode, getFileContent, listFiles } from "../services/agentService"

const AgentChat: React.FC = () => {
  const {
    messages,
    addMessage,
    sessionInfo,
    setSessionInfo,
    loadingState,
    setLoadingState,
    projectFiles,
    setProjectFiles,
    debug,
  } = useAgentContext()
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleStartSession = async (prompt: string) => {
    try {
      setLoadingState({ initializing: true })

      addMessage({
        role: "user",
        content: prompt,
      })

      // Call the requirements extractor, planner, and code generator
      const sessionData = await startSession(prompt)
      setSessionInfo(sessionData)

      // Store raw file list for debugging
      if (sessionData.fileMap) {
        debug.setRawFileList(sessionData.fileMap)
      }

      // Add the requirements and tasks as system messages
      if (sessionData.requirements) {
        addMessage({
          role: "system",
          content: `📋 Requirements:\n${sessionData.requirements}`,
        })
      }

      if (sessionData.tasks) {
        addMessage({
          role: "system",
          content: `✅ Tasks:\n${sessionData.tasks}`,
        })
      }

      // Get the list of generated files
      if (sessionData.fileMap && Array.isArray(sessionData.fileMap)) {
        // Store raw file list for debugging
        debug.setRawFileList(sessionData.fileMap)

        // Create file objects from the file map
        const files = await createFileObjectsFromMap(sessionData.sessionId, sessionData.fileMap)

        console.log("Generated files:", files)
        setProjectFiles(files)

        addMessage({
          role: "assistant",
          content: `I've generated the initial code for your project with ${files.length} files. You can view them in the file browser and make updates by providing additional instructions.`,
        })
      } else {
        console.error("No fileMap in session data or fileMap is not an array:", sessionData)
        addMessage({
          role: "assistant",
          content:
            "I've generated the initial code, but there was an issue loading the files. Please try again or check the console for errors.",
        })
      }
    } catch (error) {
      console.error("Error starting session:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      })
    } finally {
      setLoadingState({ initializing: false })
    }
  }

  const handleUpdateCode = async (instruction: string) => {
    if (!sessionInfo) {
      toast({
        title: "Error",
        description: "No active session. Please start a new session first.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoadingState({ updating: true })

      addMessage({
        role: "user",
        content: instruction,
      })

      // Call the updater agent
      const result = await updateCode(sessionInfo.sessionId, instruction)

      // Fetch the updated files
      const updatedFileList = await listFiles(sessionInfo.sessionId)
      if (updatedFileList && Array.isArray(updatedFileList)) {
        // Update the raw file list for debugging
        debug.setRawFileList(updatedFileList)

        // Create file objects from the updated file map
        const updatedFiles = await createFileObjectsFromMap(sessionInfo.sessionId, updatedFileList)
        setProjectFiles(updatedFiles)

        addMessage({
          role: "assistant",
          content: `I've updated the code based on your instructions. ${result.updatedFiles.length} files were modified.`,
        })
      } else {
        // Fallback to the previous approach if listFiles doesn't work
        const updatedProjectFiles = [...projectFiles]

        for (const filePath of result.updatedFiles) {
          try {
            const fileData = await getFileContent(sessionInfo.sessionId, filePath)

            // Check if file already exists in our list
            const existingFileIndex = updatedProjectFiles.findIndex((f) => f.path === filePath)

            const extension = filePath.split(".").pop()?.toLowerCase() || ""
            let language = "text"

            if (["js", "jsx", "ts", "tsx"].includes(extension)) language = "javascript"
            else if (["py"].includes(extension)) language = "python"
            else if (["html"].includes(extension)) language = "html"
            else if (["css"].includes(extension)) language = "css"
            else if (["json"].includes(extension)) language = "json"

            const updatedFile = {
              name: filePath.split("/").pop() || "",
              path: filePath,
              content: fileData.content,
              language,
            }

            if (existingFileIndex >= 0) {
              updatedProjectFiles[existingFileIndex] = updatedFile
            } else {
              updatedProjectFiles.push(updatedFile)
            }
          } catch (error) {
            console.error(`Error updating file ${filePath}:`, error)
          }
        }

        // Update the raw file list for debugging
        const allFilePaths = updatedProjectFiles.map((file) => file.path)
        debug.setRawFileList(allFilePaths)

        setProjectFiles(updatedProjectFiles)
      }
    } catch (error) {
      console.error("Error updating code:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update code",
        variant: "destructive",
      })
    } finally {
      setLoadingState({ updating: false })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    if (!sessionInfo) {
      await handleStartSession(userMessage)
    } else {
      await handleUpdateCode(userMessage)
    }
  }

  // Example prompts
  const examplePrompts = [
    "Create a React to-do list app with local storage",
    "Build a weather dashboard with API integration",
    "Generate a portfolio website template",
    "Make a markdown editor with preview",
  ]

  const createFileObjectsFromMap = async (sessionId: string, fileMap: string[]) => {
    return Promise.all(
      fileMap.map(async (filePath) => {
        try {
          const fileData = await getFileContent(sessionId, filePath)

          // Determine language based on file extension
          const extension = filePath.split(".").pop()?.toLowerCase() || ""
          let language = "text"

          if (["js", "jsx", "ts", "tsx"].includes(extension)) language = "javascript"
          else if (["py"].includes(extension)) language = "python"
          else if (["html"].includes(extension)) language = "html"
          else if (["css"].includes(extension)) language = "css"
          else if (["json"].includes(extension)) language = "json"

          return {
            name: filePath.split("/").pop() || "",
            path: filePath,
            content: fileData.content,
            language,
          }
        } catch (error) {
          console.error(`Error fetching file ${filePath}:`, error)
          return {
            name: filePath.split("/").pop() || "",
            path: filePath,
            content: `Error loading file: ${error instanceof Error ? error.message : "Unknown error"}`,
            language: "text",
          }
        }
      }),
    )
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      <div className="p-3 border-b flex justify-between items-center bg-muted/20">
        <h3 className="text-sm font-medium">AI Code Generator</h3>
        <div className="text-xs text-muted-foreground">
          {sessionInfo && `Session: ${sessionInfo.sessionId.substring(0, 8)}...`}
        </div>
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role === "user" ? "pl-0" : "pl-6"} animate-fade-in`}
            >
              <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar
                  className={`h-8 w-8 ${
                    message.role === "assistant"
                      ? "bg-purple-500"
                      : message.role === "system"
                        ? "bg-blue-500"
                        : "bg-gray-200"
                  }`}
                >
                  <div className="flex h-full items-center justify-center text-xs font-semibold">
                    {message.role === "assistant" ? "AI" : message.role === "system" ? "S" : "You"}
                  </div>
                </Avatar>

                <div className={`flex-1 space-y-1 ${message.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "system"
                          ? "bg-blue-100 text-foreground"
                          : "bg-secondary text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(loadingState.initializing || loadingState.updating) && (
            <div className="chat-message pl-6 animate-fade-in">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-purple-500">
                  <div className="flex h-full items-center justify-center text-xs font-semibold">AI</div>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="inline-block rounded-lg p-3 bg-secondary">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 text-muted-foreground">
                      {loadingState.initializing
                        ? "Extracting requirements, planning tasks, and generating code..."
                        : "Updating code..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Example prompts */}
      {!sessionInfo && (
        <div className="px-4 py-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt) => (
              <Button key={prompt} variant="outline" size="sm" className="text-xs" onClick={() => setInput(prompt)}>
                {prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder={
              !sessionInfo
                ? "Describe the application you want to build..."
                : "Provide instructions for code updates..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={loadingState.initializing || loadingState.updating}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || loadingState.initializing || loadingState.updating}
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AgentChat
