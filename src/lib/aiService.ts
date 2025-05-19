
// interface AIResponse {
//   message: string;
//   code?: string;
// }

// interface ChatMessage {
//   id: string;
//   content: string;
//   role: 'user' | 'ai';
//   timestamp: Date;
// }

// export async function generateAIResponse(prompt: string, previousMessages: ChatMessage[] = []): Promise<AIResponse> {
//   try {
//     // Convert frontend message format to backend format
//     const backendMessages = previousMessages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));

//     // Make API call to our Python backend
//     const response = await fetch('http://localhost:5000/api/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         messages: [
//           ...backendMessages,
//           { role: 'user', content: prompt }
//         ]
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     // Parse the response
//     const data = await response.json();
//     return {
//       message: data.message,
//       code: data.code
//     };
//   } catch (error) {
//     console.error("Error calling Python backend:", error);
    
//     // Fallback to mock service if backend is unavailable
//     return fallbackToMockService(prompt);
//   }
// }

// // Fallback to mock service when backend is not available
// function fallbackToMockService(prompt: string): AIResponse {
//   console.log("Falling back to mock service for:", prompt);
  
//   const promptLower = prompt.toLowerCase();
  
//   // Simple keyword matching like in the original mock
//   if (promptLower.includes('button') || promptLower.includes('click')) {
//     return {
//       message: "Fallback mode: Here's a simple button component with hover effects using Tailwind CSS:",
//       code: `<button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded">
//   Click Me
// </button>`
//     };
//   } else if (promptLower.includes('counter') || promptLower.includes('increment')) {
//     return {
//       message: "Fallback mode: I've created a counter component with increment and decrement functionality:",
//       code: `import React, { useState } from 'react';

// function Counter() {
//   const [count, setCount] = useState(0);
  
//   return (
//     <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold">Counter: {count}</h2>
//       <div className="flex space-x-4">
//         <button 
//           onClick={() => setCount(count - 1)}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
//         >
//           Decrease
//         </button>
//         <button 
//           onClick={() => setCount(count + 1)}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
//         >
//           Increase
//         </button>
//       </div>
//     </div>
//   );
// }`
//     };
//   } else {
//     return {
//       message: "Fallback mode: The Python backend is currently unavailable. Please start the Python backend service or check connection settings."
//     };
//   }
// }

// // Function to check if backend is available
// export async function checkBackendHealth(): Promise<boolean> {
//   try {
//     const response = await fetch('http://localhost:5000/api/health');
//     return response.ok;
//   } catch (error) {
//     console.error("Backend health check failed:", error);
//     return false;
//   }
// }



// interface AIResponse {
//   message: string;
//   code?: string;
//   files?: CodeFile[];
// }

// interface CodeFile {
//   name: string;
//   content: string;
//   language?: string;
// }

// interface ChatMessage {
//   id: string;
//   content: string;
//   role: 'user' | 'ai';
//   timestamp: Date;
// }

// export async function generateAIResponse(prompt: string, previousMessages: ChatMessage[] = []): Promise<AIResponse> {
//   try {
//     // Detect if this is a project generation request
//     const isProjectRequest = prompt.toLowerCase().includes('project') || 
//                               prompt.toLowerCase().includes('create') || 
//                               prompt.toLowerCase().includes('generate full') ||
//                               prompt.toLowerCase().includes('build');
                              
//     // Enhance prompt for project requests
//     let enhancedPrompt = prompt;
//     if (isProjectRequest && !prompt.toLowerCase().includes('file')) {
//       enhancedPrompt = `${prompt}. Please organize the solution as multiple files with proper directory structure that can be run directly in a browser preview and be ready to push to GitHub.`;
//     }

//     // Convert frontend message format to backend format
//     const backendMessages = previousMessages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));
    
//     // Add the current prompt as the latest user message
//     const allBackendMessages = [...backendMessages, { role: 'user', content: enhancedPrompt }];

//     // Make API call to our Python backend
//     const response = await fetch('http://localhost:5000/api/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: enhancedPrompt,
//         messages: allBackendMessages
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     // Parse the response
//     const data = await response.json();
    
//     // Process response to extract files if present
//     const files = extractProjectFiles(data.message);
    
//     return {
//       message: data.message,
//       code: data.code,
//       files: files.length > 0 ? files : undefined
//     };
//   } catch (error) {
//     console.error("Error calling Python backend:", error);
    
//     // Fallback to mock service if backend is unavailable
//     return fallbackToMockService(prompt);
//   }
// }

// // Extract project files from AI response
// function extractProjectFiles(message: string): CodeFile[] {
//   const files: CodeFile[] = [];
  
//   // Look for file blocks in the format ```filename.ext\ncontent\n```
//   const fileBlockRegex = /```(\S+)\s*\n([\s\S]+?)```/g;
//   let match;
  
//   while ((match = fileBlockRegex.exec(message)) !== null) {
//     const filename = match[1].trim();
//     const content = match[2];
    
//     // Skip if it's just a language identifier like ```javascript
//     if (!filename.includes('.') && filename.length < 10) {
//       continue;
//     }
    
//     // Determine language from file extension
//     const extension = filename.split('.').pop() || '';
//     const language = getLanguageFromExtension(extension);
    
//     files.push({
//       name: filename,
//       content,
//       language
//     });
//   }
  
//   // Alternative format: Look for "File: filename.ext" followed by code blocks
//   const fileHeaderRegex = /File:\s*(\S+)\s*\n```[\w-]*\n([\s\S]+?)```/g;
//   while ((match = fileHeaderRegex.exec(message)) !== null) {
//     const filename = match[1].trim();
//     const content = match[2];
    
//     // Determine language from file extension
//     const extension = filename.split('.').pop() || '';
//     const language = getLanguageFromExtension(extension);
    
//     // Check if this file was already added by the first regex
//     if (!files.some(f => f.name === filename)) {
//       files.push({
//         name: filename,
//         content,
//         language
//       });
//     }
//   }
  
//   return files;
// }

// // Helper to determine language from file extension
// function getLanguageFromExtension(extension: string): string {
//   const mapping: Record<string, string> = {
//     'js': 'javascript',
//     'jsx': 'javascript',
//     'ts': 'typescript',
//     'tsx': 'typescript',
//     'py': 'python',
//     'html': 'html',
//     'css': 'css',
//     'json': 'json',
//     'md': 'markdown',
//     'yml': 'yaml',
//     'yaml': 'yaml',
//     'sh': 'bash',
//     'bash': 'bash',
//     'txt': 'text',
//   };
  
//   return mapping[extension.toLowerCase()] || 'text';
// }

// // Fallback to mock service when backend is not available
// function fallbackToMockService(prompt: string): AIResponse {
//   console.log("Falling back to mock service for:", prompt);
  
//   const promptLower = prompt.toLowerCase();
  
//   // Check if this is a project generation request
//   if (promptLower.includes('project') || promptLower.includes('github')) {
//     // Mock a React project structure
//     return {
//       message: "Fallback mode: I've created a simple React project that you can run in the preview and push to GitHub:",
//       files: [
//         {
//           name: 'index.html',
//           content: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>React App</title>
//   <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
//   <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
//   <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//   <link href="styles.css" rel="stylesheet">
// </head>
// <body>
//   <div id="root"></div>
//   <script type="text/babel" src="App.js"></script>
//   <script type="text/babel" src="index.js"></script>
// </body>
// </html>`,
//           language: 'html'
//         },
//         {
//           name: 'styles.css',
//           content: `body {
//   margin: 0;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
//   -webkit-font-smoothing: antialiased;
//   background-color: #f5f5f5;
// }

// .app {
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 20px;
// }

// .header {
//   text-align: center;
//   margin-bottom: 30px;
// }

// .task-form {
//   display: flex;
//   margin-bottom: 20px;
// }

// .task-input {
//   flex: 1;
//   padding: 10px;
//   border: 1px solid #ddd;
//   border-radius: 4px 0 0 4px;
//   font-size: 16px;
// }

// .add-button {
//   background-color: #4c6ef5;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 0 4px 4px 0;
//   cursor: pointer;
//   font-size: 16px;
// }

// .task-list {
//   list-style: none;
//   padding: 0;
// }

// .task-item {
//   display: flex;
//   align-items: center;
//   padding: 10px;
//   background-color: white;
//   border-radius: 4px;
//   margin-bottom: 10px;
//   box-shadow: 0 1px 3px rgba(0,0,0,0.1);
// }

// .task-complete {
//   text-decoration: line-through;
//   color: #888;
// }

// .task-text {
//   flex: 1;
//   margin: 0 10px;
// }

// .delete-button {
//   background-color: #ff6b6b;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 4px;
//   cursor: pointer;
// }`,
//           language: 'css'
//         },
//         {
//           name: 'App.js',
//           content: `function App() {
//   const [tasks, setTasks] = React.useState(() => {
//     const savedTasks = localStorage.getItem('tasks');
//     return savedTasks ? JSON.parse(savedTasks) : [];
//   });
//   const [taskText, setTaskText] = React.useState('');

//   React.useEffect(() => {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//   }, [tasks]);

//   const addTask = () => {
//     if (taskText.trim() === '') return;
    
//     const newTask = {
//       id: Date.now(),
//       text: taskText,
//       completed: false
//     };
    
//     setTasks([...tasks, newTask]);
//     setTaskText('');
//   };

//   const toggleTask = (id) => {
//     setTasks(tasks.map(task => 
//       task.id === id ? { ...task, completed: !task.completed } : task
//     ));
//   };

//   const deleteTask = (id) => {
//     setTasks(tasks.filter(task => task.id !== id));
//   };

//   return (
//     <div className="app">
//       <div className="header">
//         <h1>React Todo App</h1>
//         <p>Tasks are saved in your browser</p>
//       </div>
      
//       <div className="task-form">
//         <input
//           type="text"
//           className="task-input"
//           placeholder="Add a new task..."
//           value={taskText}
//           onChange={(e) => setTaskText(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && addTask()}
//         />
//         <button className="add-button" onClick={addTask}>Add</button>
//       </div>
      
//       <ul className="task-list">
//         {tasks.map(task => (
//           <li 
//             key={task.id} 
//             className={task.completed ? "task-item task-complete" : "task-item"}
//           >
//             <input
//               type="checkbox"
//               checked={task.completed}
//               onChange={() => toggleTask(task.id)}
//             />
//             <span className="task-text">{task.text}</span>
//             <button 
//               className="delete-button"
//               onClick={() => deleteTask(task.id)}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
      
//       {tasks.length === 0 && (
//         <p style={{ textAlign: 'center', color: '#888' }}>
//           No tasks yet. Add one above!
//         </p>
//       )}
//     </div>
//   );
// }`,
//           language: 'javascript'
//         },
//         {
//           name: 'index.js',
//           content: `ReactDOM.render(<App />, document.getElementById('root'));`,
//           language: 'javascript'
//         },
//         {
//           name: 'README.md',
//           content: `# React Todo App

// This is a simple React Todo application that runs directly in the browser.

// ## Features

// - Add new tasks
// - Mark tasks as complete
// - Delete tasks
// - Tasks persist in local storage

// ## How to Run

// Simply open the index.html file in a browser.

// ## Project Structure

// - index.html - Main HTML file
// - App.js - Main React component
// - index.js - React entry point
// - styles.css - CSS styles

// ## Pushing to GitHub

// 1. Create a new repository on GitHub
// 2. Initialize a local git repository:
//    \`\`\`
//    git init
//    git add .
//    git commit -m "Initial commit"
//    \`\`\`
// 3. Add your GitHub repository as remote:
//    \`\`\`
//    git remote add origin https://github.com/yourusername/your-repo.git
//    git push -u origin main
//    \`\`\`
// `,
//           language: 'markdown'
//         }
//       ]
//     };
//   } else if (promptLower.includes('button') || promptLower.includes('click')) {
//     return {
//       message: "Fallback mode: Here's a simple button component with hover effects using Tailwind CSS:",
//       code: `<button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded">
//   Click Me
// </button>`
//     };
//   } else if (promptLower.includes('counter') || promptLower.includes('increment')) {
//     return {
//       message: "Fallback mode: I've created a counter component with increment and decrement functionality:",
//       code: `import React, { useState } from 'react';

// function Counter() {
//   const [count, setCount] = useState(0);
  
//   return (
//     <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold">Counter: {count}</h2>
//       <div className="flex space-x-4">
//         <button 
//           onClick={() => setCount(count - 1)}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
//         >
//           Decrease
//         </button>
//         <button 
//           onClick={() => setCount(count + 1)}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
//         >
//           Increase
//         </button>
//       </div>
//     </div>
//   );
// }`
//     };
//   } else {
//     return {
//       message: "Fallback mode: The Python backend is currently unavailable. Please start the Python backend service or check connection settings."
//     };
//   }
// }

// // Function to check if backend is available
// export async function checkBackendHealth(): Promise<boolean> {
//   try {
//     const response = await fetch('http://localhost:5000/api/health');
//     return response.ok;
//   } catch (error) {
//     console.error("Backend health check failed:", error);
//     return false;
//   }
// }


interface AIResponse {
  message: string;
  code?: string;
  files?: CodeFile[];
}

interface CodeFile {
  name: string;
  content: string;
  language?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}

export async function generateAIResponse(prompt: string, previousMessages: ChatMessage[] = []): Promise<AIResponse> {
  try {
    // Detect if this is a project generation request
    const isProjectRequest = prompt.toLowerCase().includes('project') || 
                             prompt.toLowerCase().includes('create') || 
                             prompt.toLowerCase().includes('generate full') ||
                             prompt.toLowerCase().includes('build');
                            
    // Enhance prompt for project requests
    let enhancedPrompt = prompt;
    if (isProjectRequest && !prompt.toLowerCase().includes('file')) {
      enhancedPrompt = `${prompt}. Please organize the solution as multiple files with proper directory structure that can be run directly in a browser preview and be ready to push to GitHub.`;
    }

    // Convert frontend message format to backend format
    const backendMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the current prompt as the latest user message
    const allBackendMessages = [...backendMessages, { role: 'user', content: enhancedPrompt }];

    // Make API call to our Python backend
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: enhancedPrompt,
        messages: allBackendMessages
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Process response to extract files if present
    const files = extractProjectFiles(data.message);
    
    return {
      message: data.message,
      code: data.code,
      files: files.length > 0 ? files : undefined
    };
  } catch (error) {
    console.error("Error calling Python backend:", error);
    
    // Fallback to mock service if backend is unavailable
    return fallbackToMockService(prompt);
  }
}

// Extract project files from AI response
function extractProjectFiles(message: string): CodeFile[] {
  const files: CodeFile[] = [];
  
  // Look for file blocks in the format ```filename.ext\ncontent\n```
  const fileBlockRegex = /```(\S+)\s*\n([\s\S]+?)```/g;
  let match;
  
  while ((match = fileBlockRegex.exec(message)) !== null) {
    const filename = match[1].trim();
    const content = match[2];
    
    // Skip if it's just a language identifier like ```javascript
    if (!filename.includes('.') && filename.length < 10) {
      continue;
    }
    
    // Determine language from file extension
    const extension = filename.split('.').pop() || '';
    const language = getLanguageFromExtension(extension);
    
    files.push({
      name: filename,
      content,
      language
    });
  }
  
  // Alternative format: Look for "File: filename.ext" followed by code blocks
  const fileHeaderRegex = /File:\s*(\S+)\s*\n```[\w-]*\n([\s\S]+?)```/g;
  while ((match = fileHeaderRegex.exec(message)) !== null) {
    const filename = match[1].trim();
    const content = match[2];
    
    // Determine language from file extension
    const extension = filename.split('.').pop() || '';
    const language = getLanguageFromExtension(extension);
    
    // Check if this file was already added by the first regex
    if (!files.some(f => f.name === filename)) {
      files.push({
        name: filename,
        content,
        language
      });
    }
  }
  
  return files;
}

// Helper to determine language from file extension
function getLanguageFromExtension(extension: string): string {
  const mapping: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'yml': 'yaml',
    'yaml': 'yaml',
    'sh': 'bash',
    'bash': 'bash',
    'txt': 'text',
  };
  
  return mapping[extension.toLowerCase()] || 'text';
}

// Fallback to mock service when backend is not available
function fallbackToMockService(prompt: string): AIResponse {
  console.log("Falling back to mock service for:", prompt);
  
  const promptLower = prompt.toLowerCase();
  
  // Check if this is a project generation request
  if (promptLower.includes('project') || promptLower.includes('github')) {
    // Mock a React project structu
    return {
      message: "Fallback mode: I've created a simple React project that you can run in the preview and push to GitHub:",
      files: [
        {
          name: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
  <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link href="styles.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="App.js"></script>
  <script type="text/babel" src="index.js"></script>
</body>
</html>`,
          language: 'html'
        },
        {
          name: 'styles.css',
          content: `body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            background-color: #f5f5f5;
          }
          
          .app {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .task-form {
            display: flex;
            margin-bottom: 20px;
          }
          
          .task-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
            font-size: 16px;
          }
          
          .add-button {
            background-color: #4c6ef5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            font-size: 16px;
          }
          
          .task-list {
            list-style: none;
            padding: 0;
          }
          
          .task-item {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .task-complete {
            text-decoration: line-through;
            color: #888;
          }
          
          .task-text {
            flex: 1;
            margin: 0 10px;
          }
          
          .delete-button {
            background-color: #ff6b6b;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
          }`,
                    language: 'css'
                  },
                  {
                    name: 'App.js',
                    content: `function App() {
            const [tasks, setTasks] = React.useState(() => {
              const savedTasks = localStorage.getItem('tasks');
              return savedTasks ? JSON.parse(savedTasks) : [];
            });
            const [taskText, setTaskText] = React.useState('');
          
            React.useEffect(() => {
              localStorage.setItem('tasks', JSON.stringify(tasks));
            }, [tasks]);
          
            const addTask = () => {
              if (taskText.trim() === '') return;
              
              const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
              };
              
              setTasks([...tasks, newTask]);
              setTaskText('');
            };
          
            const toggleTask = (id) => {
              setTasks(tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
              ));
            };
          
            const deleteTask = (id) => {
              setTasks(tasks.filter(task => task.id !== id));
            };
          
            return (
              <div className="app">
                <div className="header">
                  <h1>React Todo App</h1>
                  <p>Tasks are saved in your browser</p>
                </div>
                
                <div className="task-form">
                  <input
                    type="text"
                    className="task-input"
                    placeholder="Add a new task..."
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button className="add-button" onClick={addTask}>Add</button>
                </div>
                
                <ul className="task-list">
                  {tasks.map(task => (
                    <li 
                      key={task.id} 
                      className={task.completed ? "task-item task-complete" : "task-item"}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="task-text">{task.text}</span>
                      <button 
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                
                {tasks.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#888' }}>
                    No tasks yet. Add one above!
                  </p>
                )}
              </div>
            );
          }`,
                    language: 'javascript'
                  },
                  {
                    name: 'index.js',
                    content: `ReactDOM.render(<App />, document.getElementById('root'));`,
                    language: 'javascript'
                  },
                  {
                    name: 'README.md',
                    content: `# React Todo App
          
          This is a simple React Todo application that runs directly in the browser.
          
          ## Features
          
          - Add new tasks
          - Mark tasks as complete
          - Delete tasks
          - Tasks persist in local storage
          
          ## How to Run
          
          Simply open the index.html file in a browser.
          
          ## Project Structure
          
          - index.html - Main HTML file
          - App.js - Main React component
          - index.js - React entry point
          - styles.css - CSS styles
          
          ## Pushing to GitHub
          
          1. Create a new repository on GitHub
          2. Initialize a local git repository:
             \`\`\`
             git init
             git add .
             git commit -m "Initial commit"
             \`\`\`
          3. Add your GitHub repository as remote:
             \`\`\`
             git remote add origin https://github.com/yourusername/your-repo.git
             git push -u origin main
             \`\`\`
          `,
                    language: 'markdown'
        }
      ]
    };
  } else if (promptLower.includes('button') || promptLower.includes('click')) {
    return {
      message: "Fallback mode: Here's a simple button component with hover effects using Tailwind CSS:",
      code: `<button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded">
  Click Me
</button>`
    };
  } else if (promptLower.includes('counter') || promptLower.includes('increment')) {
    return {
      message: "Fallback mode: I've created a counter component with increment and decrement functionality:",
      code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <div className="flex space-x-4">
        <button 
          onClick={() => setCount(count - 1)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Decrease
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Increase
        </button>
      </div>
    </div>
  );
}`
    };
  } else {
    return {
      message: "Fallback mode: The Python backend is currently unavailable. Please start the Python backend service or check connection settings."
    };
  }
}

// Function to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    return response.ok;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
}

