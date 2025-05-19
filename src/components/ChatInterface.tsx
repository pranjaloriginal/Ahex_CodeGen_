
// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar } from "@/components/ui/avatar";
// import { Send, Wifi, WifiOff } from "lucide-react";
// import { generateAIResponse, checkBackendHealth } from '@/lib/aiService';
// import { useToast } from '@/components/ui/use-toast';
// import { Badge } from "@/components/ui/badge";

// interface Message {
//   id: string;
//   content: string;
//   role: 'user' | 'ai';
//   timestamp: Date;
// }

// interface ChatInterfaceProps {
//   onCodeGenerated: (code: string) => void;
// }

// const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCodeGenerated }) => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       content: "Hi there! 👋 I'm your AI coding assistant powered by Python LangGraph and OpenAI. What would you like to build today?",
//       role: 'ai',
//       timestamp: new Date()
//     }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [backendConnected, setBackendConnected] = useState(false);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();

//   // Check backend health on component mount
//   useEffect(() => {
//     const checkBackend = async () => {
//       const isConnected = await checkBackendHealth();
//       setBackendConnected(isConnected);
      
//       if (!isConnected) {
//         toast({
//           title: "Backend not connected",
//           description: "Using fallback mock service. Start the Python backend to use LangGraph.",
//           variant: "destructive",
//           duration: 6000,
//         });
//       } else {
//         toast({
//           title: "Python Backend Connected",
//           description: "Successfully connected to Python LangGraph backend.",
//           duration: 3000,
//         });
//       }
//     };
    
//     checkBackend();
    
//     // Set up interval to check backend connectivity
//     const interval = setInterval(checkBackend, 30000); // Check every 30 seconds
    
//     return () => clearInterval(interval);
//   }, [toast]);

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     if (scrollAreaRef.current) {
//       const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
//       if (scrollContainer) {
//         scrollContainer.scrollTop = scrollContainer.scrollHeight;
//       }
//     }
//   }, [messages]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!input.trim()) return;
    
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: input,
//       role: 'user',
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);
    
//     try {
//       // Pass all previous messages for context
//       const response = await generateAIResponse(input, messages);
      
//       setMessages(prev => [
//         ...prev, 
//         {
//           id: (Date.now() + 1).toString(),
//           content: response.message,
//           role: 'ai',
//           timestamp: new Date()
//         }
//       ]);
      
//       if (response.code) {
//         onCodeGenerated(response.code);
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to generate response. Please try again.",
//         variant: "destructive"
//       });
//       console.error("Error generating AI response:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
//       <div className="p-3 border-b bg-secondary/30 flex justify-between items-center">
//         <h3 className="text-sm font-medium">Chat</h3>
//         <div className="flex items-center gap-2">
//           <Badge variant={backendConnected ? "outline" : "destructive"} className="flex items-center gap-1">
//             {backendConnected ? (
//               <>
//                 <Wifi className="h-3 w-3" />
//                 <span className="text-xs">Python Backend</span>
//               </>
//             ) : (
//               <>
//                 <WifiOff className="h-3 w-3" />
//                 <span className="text-xs">Fallback Mode</span>
//               </>
//             )}
//           </Badge>
//         </div>
//       </div>
      
//       <ScrollArea className="flex-1" ref={scrollAreaRef}>
//         <div className="p-4 space-y-4">
//           {messages.map((message) => (
//             <div 
//               key={message.id} 
//               className={`chat-message ${message.role === 'ai' ? 'ai pl-6' : 'pl-0'} animate-fade-in`}
//             >
//               <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
//                 <Avatar className={`h-8 w-8 ${message.role === 'ai' ? 'bg-purple-500' : 'bg-gray-200'}`}>
//                   <div className="flex h-full items-center justify-center text-xs font-semibold">
//                     {message.role === 'ai' ? 'AI' : 'You'}
//                   </div>
//                 </Avatar>
                
//                 <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
//                   <div className={`inline-block max-w-[85%] rounded-lg p-3 ${
//                     message.role === 'ai' 
//                       ? 'bg-secondary text-foreground' 
//                       : 'bg-primary text-primary-foreground'
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
          
//           {isLoading && (
//             <div className="chat-message ai pl-6 animate-fade-in">
//               <div className="flex gap-3">
//                 <Avatar className="h-8 w-8 bg-purple-500">
//                   <div className="flex h-full items-center justify-center text-xs font-semibold">
//                     AI
//                   </div>
//                 </Avatar>
                
//                 <div className="flex-1 space-y-1">
//                   <div className="inline-block rounded-lg p-3 bg-secondary">
//                     <div className="flex space-x-1">
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                       <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </ScrollArea>
      
//       <form onSubmit={handleSubmit} className="p-3 border-t">
//         <div className="flex gap-2">
//           <Textarea 
//             placeholder="Ask me to build something..." 
//             value={input} 
//             onChange={(e) => setInput(e.target.value)}
//             className="min-h-[60px] resize-none"
//             disabled={isLoading}
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
//             disabled={!input.trim() || isLoading}
//             className="h-[60px] w-[60px]"
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatInterface;



import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Send, Wifi, WifiOff, Code, Github } from "lucide-react";
import { generateAIResponse, checkBackendHealth } from '@/lib/aiService';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";

interface CodeFile {
  name: string;
  content: string;
  language?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: string) => void;
  onProjectFilesGenerated?: (files: CodeFile[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onCodeGenerated, 
  onProjectFilesGenerated 
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! 👋 I'm your AI coding assistant powered by Python LangGraph and OpenAI. What would you like to build today? Ask me to generate a project for you that can be run directly in the preview and pushed to GitHub!",
      role: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Suggestion templates
  const suggestions = [
    "Create a React todo app with local storage",
    "Generate a responsive landing page with Tailwind CSS",
    "Build a simple weather dashboard with API integration",
    "Make a markdown preview editor with React"
  ];

  // Check backend health on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const isConnected = await checkBackendHealth();
      setBackendConnected(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Backend not connected",
          description: "Using fallback mock service. Start the Python backend to use LangGraph.",
          variant: "destructive",
          duration: 6000,
        });
      } else {
        toast({
          title: "Python Backend Connected",
          description: "Successfully connected to Python LangGraph backend.",
          duration: 3000,
        });
      }
    };
    
    checkBackend();
    
    // Set up interval to check backend connectivity
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [toast]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Enhance prompt for project generation if needed
      let enhancedInput = input;
      if (input.toLowerCase().includes("create") || 
          input.toLowerCase().includes("generate") || 
          input.toLowerCase().includes("build") ||
          input.toLowerCase().includes("make")) {
        
        if (!input.toLowerCase().includes("project")) {
          // Add project context if it seems like a project request
          enhancedInput = `Create a project with the following: ${input}. Please organize it into multiple files that can be run directly in the browser and pushed to GitHub.`;
        }
      }
      
      // Pass all previous messages for context
      const response = await generateAIResponse(enhancedInput, messages);
      
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          content: response.message,
          role: 'ai',
          timestamp: new Date()
        }
      ]);
      
      if (response.code) {
        onCodeGenerated(response.code);
      }
      
      if (response.files && response.files.length > 0 && onProjectFilesGenerated) {
        onProjectFilesGenerated(response.files);
        toast({
          title: "Project Generated",
          description: `Generated ${response.files.length} project files. You can run them in the preview, edit, or push to GitHub.`,
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
      console.error("Error generating AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b bg-secondary/30 flex justify-between items-center">
        <h3 className="text-sm font-medium">Chat</h3>
        <div className="flex items-center gap-2">
          <Badge variant={backendConnected ? "outline" : "destructive"} className="flex items-center gap-1">
            {backendConnected ? (
              <>
                <Wifi className="h-3 w-3" />
                <span className="text-xs">Python Backend</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">Fallback Mode</span>
              </>
            )}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`chat-message ${message.role === 'ai' ? 'ai pl-6' : 'pl-0'} animate-fade-in`}
            >
              <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className={`h-8 w-8 ${message.role === 'ai' ? 'bg-purple-500' : 'bg-gray-200'}`}>
                  <div className="flex h-full items-center justify-center text-xs font-semibold">
                    {message.role === 'ai' ? 'AI' : 'You'}
                  </div>
                </Avatar>
                
                <div className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[85%] rounded-lg p-3 ${
                    message.role === 'ai' 
                      ? 'bg-secondary text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message ai pl-6 animate-fade-in">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-purple-500">
                  <div className="flex h-full items-center justify-center text-xs font-semibold">
                    AI
                  </div>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="inline-block rounded-lg p-3 bg-secondary">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Suggestions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 py-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => useSuggestion(suggestion)}
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea 
            placeholder="Ask me to generate a project that can run in preview and be pushed to GitHub..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
