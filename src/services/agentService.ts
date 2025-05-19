
// import { SessionInfo, FileContent, UpdatedFiles } from "../types/agents";

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// export async function startSession(inputText: string): Promise<SessionInfo> {
//   const formData = new FormData();
//   formData.append('input_text', inputText);
  
//   const response = await fetch(`${API_URL}/start_session`, {
//     method: 'POST',
//     body: formData,
//   });
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to start session');
//   }
  
//   return response.json();
// }

// export async function updateCode(sessionId: string, userInstruction: string): Promise<UpdatedFiles> {
//   const formData = new FormData();
//   formData.append('session_id', sessionId);
//   formData.append('user_instruction', userInstruction);
  
//   const response = await fetch(`${API_URL}/update_code`, {
//     method: 'POST',
//     body: formData,
//   });
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to update code');
//   }
  
//   return response.json();
// }

// export async function getFileContent(sessionId: string, filepath: string): Promise<FileContent> {
//   const response = await fetch(`${API_URL}/get_file/${sessionId}/${filepath}`);
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to get file content');
//   }
  
//   return response.json();
// }

// export async function listFiles(sessionId: string): Promise<string[]> {
//   const response = await fetch(`${API_URL}/list_files/${sessionId}`);
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to list files');
//   }
  
//   const data = await response.json();
//   return data.files;
// }

// export async function pushToGithub(sessionId: string, repoName: string, githubUsername: string): Promise<{repo_url: string}> {
//   const formData = new FormData();
//   formData.append('session_id', sessionId);
//   formData.append('repo_name', repoName);
//   formData.append('github_username', githubUsername);
  
//   const response = await fetch(`${API_URL}/push_to_github`, {
//     method: 'POST',
//     body: formData,
//   });
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to push to GitHub');
//   }
  
//   return response.json();
// }



import { SessionInfo, FileContent, UpdatedFiles } from "../types/agents";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function startSession(inputText: string): Promise<SessionInfo> {
  const formData = new FormData();
  formData.append('input_text', inputText);
  
  const response = await fetch(`${API_URL}/start_session`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to start session');
  }
  
  return response.json();
}

export async function updateCode(sessionId: string, userInstruction: string): Promise<UpdatedFiles> {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('user_instruction', userInstruction);
  
  const response = await fetch(`${API_URL}/update_code`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update code');
  }
  
  return response.json();
}

export async function getFileContent(sessionId: string, filepath: string): Promise<FileContent> {
  const response = await fetch(`${API_URL}/get_file/${sessionId}/${filepath}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get file content');
  }
  
  return response.json();
}

export async function listFiles(sessionId: string): Promise<string[]> {
  const response = await fetch(`${API_URL}/list_files/${sessionId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to list files');
  }
  
  const data = await response.json();
  return data.files;
}

export async function pushToGithub(sessionId: string, repoName: string, githubUsername: string): Promise<{repo_url: string}> {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('repo_name', repoName);
  formData.append('github_username', githubUsername);
  
  const response = await fetch(`${API_URL}/push_to_github`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to push to GitHub');
  }
  
  return response.json();
}
