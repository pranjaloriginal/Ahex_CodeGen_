// export interface AgentResponse {
//     message: string;
//     code?: string;
//   }
  
//   export interface SessionInfo {
//     sessionId: string;
//     fileMap: string[];
//   }
  
//   export interface FileContent {
//     filepath: string;
//     content: string;
//   }
  
//   export interface UpdatedFiles {
//     updatedFiles: string[];
//   }
  
//   export interface ProjectFile {
//     name: string;
//     path: string;
//     content: string;
//     language: string;
//   }
  
//   export interface ChatMessage {
//     id: string;
//     role: 'user' | 'system' | 'assistant';
//     content: string;
//     timestamp: Date;
//   }


export interface AgentResponse {
    message: string;
    code?: string;
  }
  
  export interface SessionInfo {
    sessionId: string;
    fileMap: string[];
    requirements?: string;
    tasks?: string;
  }
  
  export interface FileContent {
    filepath: string;
    content: string;
  }
  
  export interface UpdatedFiles {
    updatedFiles: string[];
  }
  
  export interface ProjectFile {
    name: string;
    path: string;
    content: string;
    language: string;
  }
  
  export interface ChatMessage {
    id: string;
    role: 'user' | 'system' | 'assistant';
    content: string;
    timestamp: Date;
  }
  
  export interface TaskPlannerResult {
    requirements: string;
    tasks: string;
  }
  