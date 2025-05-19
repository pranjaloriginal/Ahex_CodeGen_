
// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { ChatMessage, ProjectFile, SessionInfo } from '../types/agents';

// interface AgentContextType {
//   sessionInfo: SessionInfo | null;
//   setSessionInfo: (info: SessionInfo | null) => void;
//   messages: ChatMessage[];
//   addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
//   clearMessages: () => void;
//   projectFiles: ProjectFile[];
//   setProjectFiles: (files: ProjectFile[]) => void;
//   loadingState: {
//     initializing: boolean;
//     updating: boolean;
//     fetching: boolean;
//   };
//   setLoadingState: (state: Partial<{ initializing: boolean; updating: boolean; fetching: boolean }>) => void;
//   selectedFile: ProjectFile | null;
//   setSelectedFile: (file: ProjectFile | null) => void;
// }

// const AgentContext = createContext<AgentContextType | undefined>(undefined);

// export const useAgentContext = (): AgentContextType => {
//   const context = useContext(AgentContext);
//   if (!context) {
//     throw new Error('useAgentContext must be used within an AgentProvider');
//   }
//   return context;
// };

// export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       id: 'welcome',
//       role: 'system',
//       content: 'Welcome to the AI Code Generator! Describe the application you want to build, and I will generate code for you.',
//       timestamp: new Date(),
//     },
//   ]);
//   const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
//   const [loadingState, setLoadingState] = useState({
//     initializing: false,
//     updating: false,
//     fetching: false,
//   });
//   const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);

//   const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
//     const newMessage = {
//       ...message,
//       id: Date.now().toString(),
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   const clearMessages = () => {
//     setMessages([{
//       id: 'welcome',
//       role: 'system',
//       content: 'Welcome to the AI Code Generator! Describe the application you want to build, and I will generate code for you.',
//       timestamp: new Date(),
//     }]);
//   };

//   const updateLoadingState = (state: Partial<{ initializing: boolean; updating: boolean; fetching: boolean }>) => {
//     setLoadingState((prev) => ({ ...prev, ...state }));
//   };

//   return (
//     <AgentContext.Provider
//       value={{
//         sessionInfo,
//         setSessionInfo,
//         messages,
//         addMessage,
//         clearMessages,
//         projectFiles,
//         setProjectFiles,
//         loadingState,
//         setLoadingState: updateLoadingState,
//         selectedFile,
//         setSelectedFile,
//       }}
//     >
//       {children}
//     </AgentContext.Provider>
//   );
// };




import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, ProjectFile, SessionInfo } from '../types/agents';

interface AgentContextType {
  sessionInfo: SessionInfo | null;
  setSessionInfo: (info: SessionInfo | null) => void;
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  projectFiles: ProjectFile[];
  setProjectFiles: (files: ProjectFile[]) => void;
  loadingState: {
    initializing: boolean;
    updating: boolean;
    fetching: boolean;
  };
  setLoadingState: (state: Partial<{ initializing: boolean; updating: boolean; fetching: boolean }>) => void;
  selectedFile: ProjectFile | null;
  setSelectedFile: (file: ProjectFile | null) => void;
  debug: {
    rawFileList: string[];
    setRawFileList: (files: string[]) => void;
  };
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgentContext = (): AgentContextType => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  return context;
};

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Welcome to the AI Code Generator! Describe the application you want to build, and I will generate code for you.',
      timestamp: new Date(),
    },
  ]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [rawFileList, setRawFileList] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState({
    initializing: false,
    updating: false,
    fetching: false,
  });
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([{
      id: 'welcome',
      role: 'system',
      content: 'Welcome to the AI Code Generator! Describe the application you want to build, and I will generate code for you.',
      timestamp: new Date(),
    }]);
  };

  const updateLoadingState = (state: Partial<{ initializing: boolean; updating: boolean; fetching: boolean }>) => {
    setLoadingState((prev) => ({ ...prev, ...state }));
  };

  return (
    <AgentContext.Provider
      value={{
        sessionInfo,
        setSessionInfo,
        messages,
        addMessage,
        clearMessages,
        projectFiles,
        setProjectFiles,
        loadingState,
        setLoadingState: updateLoadingState,
        selectedFile,
        setSelectedFile,
        debug: {
          rawFileList,
          setRawFileList,
        }
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};
