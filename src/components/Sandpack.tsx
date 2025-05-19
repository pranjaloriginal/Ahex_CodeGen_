


// import React from 'react';
// import { ProjectFile } from '../types/agents';
// import { cn } from '@/lib/utils';
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackPreview,
//   SandpackConsole,
//   SandpackCodeEditor,
//   SandpackFileExplorer
// } from '@codesandbox/sandpack-react';
// import { githubLight } from '@codesandbox/sandpack-themes'; // ✅ Theme import

// interface SandpackProps {
//   files: ProjectFile[];
//   activeFile?: string;
// }

// const Sandpack: React.FC<SandpackProps> = ({ files, activeFile }) => {
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   const sandpackFiles = React.useMemo(() => {
//     if (!files || files.length === 0) {
//       console.warn("No files provided to Sandpack component");
//       return {};
//     }

//     const result: Record<string, { code: string }> = {};

//     files.forEach(file => {
//       const normalizedPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
//       result[normalizedPath] = { code: file.content };
//     });

//     if (!result['index.html'] && !Object.keys(result).some(path => path.endsWith('index.html'))) {
//       result['index.html'] = {
//         code: `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8">
//     <title>Project Preview</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <style>
//       body { font-family: sans-serif; margin: 0; padding: 0; }
//       #root { min-height: 100vh; width: 100%; }
//     </style>
//   </head>
//   <body>
//     <div id="root"></div>
//     <script type="module" src="/index.js"></script>
//   </body>
// </html>`
//       };
//     }

//     console.log('Files to render in Sandpack:', Object.keys(result));
//     return result;
//   }, [files]);

//   const getTemplate = React.useMemo(() => {
//     const hasTypeScript = files.some(file => file.path.endsWith('.ts') || file.path.endsWith('.tsx'));
//     const hasReact = files.some(file =>
//       file.path.endsWith('.jsx') ||
//       file.path.endsWith('.tsx') ||
//       file.content.includes('import React') ||
//       file.content.includes('from "react"')
//     );

//     if (hasReact && hasTypeScript) return "react-ts";
//     if (hasReact) return "react";
//     if (hasTypeScript) return "vanilla-ts";
//     return "vanilla";
//   }, [files]);

//   const dependencies = React.useMemo(() => {
//     const deps: Record<string, string> = {};

//     if (getTemplate === "react" || getTemplate === "react-ts") {
//       deps['react'] = "^18.2.0";
//       deps['react-dom'] = "^18.2.0";
//     }

//     if (getTemplate === "react-ts" || getTemplate === "vanilla-ts") {
//       deps['typescript'] = "^5.3.3";
//       if (getTemplate === "react-ts") {
//         deps['@types/react'] = "^18.2.45";
//         deps['@types/react-dom'] = "^18.2.18";
//       }
//     }

//     if (files.some(file => file.content.includes('tailwind'))) {
//       deps['tailwindcss'] = "^3.4.0";
//     }

//     return deps;
//   }, [files, getTemplate]);

//   const entryFile = React.useMemo(() => {
//     const possibleEntries = [
//       'index.html',
//       'src/index.html',
//       'public/index.html',
//       'index.js',
//       'src/index.js',
//       'index.jsx',
//       'src/index.jsx',
//       'index.ts',
//       'src/index.ts',
//       'index.tsx',
//       'src/index.tsx',
//       'App.js',
//       'src/App.js',
//       'App.jsx',
//       'src/App.jsx',
//       'App.ts',
//       'src/App.ts',
//       'App.tsx',
//       'src/App.tsx'
//     ];

//     for (const entry of possibleEntries) {
//       if (files.some(file => file.path === entry || file.path === `/${entry}`)) {
//         return entry;
//       }
//     }

//     return files[0]?.path || '/index.html';
//   }, [files]);

//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   React.useEffect(() => {
//     const handleError = (e: ErrorEvent) => {
//       console.error('Sandpack error:', e.error);
//       setError(e.error?.message || 'Error in preview');
//     };

//     window.addEventListener('error', handleError);
//     return () => {
//       window.removeEventListener('error', handleError);
//     };
//   }, []);

//   if (files.length === 0) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <p className="text-muted-foreground">No files to preview</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full relative">
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
//           <div className="flex flex-col items-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//             <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="absolute bottom-0 left-0 right-0 p-4 bg-destructive/10 border-t border-destructive/20 text-destructive text-xs">
//           <p className="font-medium">Error in preview:</p>
//           <pre className="mt-1 overflow-auto max-h-20">{error}</pre>
//         </div>
//       )}

//       <div className={cn(
//         "w-full h-full border-0",
//         error && "h-[calc(100%-6rem)]"
//       )}>
//         <SandpackProvider
//           files={sandpackFiles}
//           template={getTemplate}
//           theme={githubLight} // ✅ Added here
//           customSetup={{
//             dependencies: dependencies
//           }}
//           options={{
//             activeFile: activeFile || entryFile,
//             visibleFiles: Object.keys(sandpackFiles),
//             recompileMode: "delayed",
//             recompileDelay: 500
//           }}
//         >
//           <SandpackLayout>
//             <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton />
//           </SandpackLayout>
//         </SandpackProvider>
//       </div>
//     </div>
//   );
// };

// export default Sandpack;



'use client'

import React from 'react';
import { ProjectFile } from '../types/agents';
import { cn } from '@/lib/utils';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
  SandpackCodeEditor,
  SandpackFileExplorer
} from '@codesandbox/sandpack-react';
import { githubLight } from '@codesandbox/sandpack-themes';

interface SandpackProps {
  files: ProjectFile[];
  activeFile?: string;
}

const Sandpack: React.FC<SandpackProps> = ({ files, activeFile }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const sandpackFiles = React.useMemo(() => {
    if (!files || files.length === 0) return {};

    const result: Record<string, { code: string }> = {};

    files.forEach(file => {
      const normalizedPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
      result[normalizedPath] = { code: file.content };
    });

    if (!result['index.html']) {
      result['index.html'] = {
        code: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Project Preview</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: sans-serif; margin: 0; padding: 0; }
      #root { min-height: 100vh; width: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.js"></script>
  </body>
</html>` };
    }

    return result;
  }, [files]);

  const getTemplate = React.useMemo(() => {
    const hasTypeScript = files.some(file => file.path.endsWith('.ts') || file.path.endsWith('.tsx'));
    const hasReact = files.some(file =>
      file.path.endsWith('.jsx') ||
      file.path.endsWith('.tsx') ||
      file.content.includes('import React') ||
      file.content.includes('from "react"')
    );

    if (hasReact && hasTypeScript) return "react-ts";
    if (hasReact) return "react";
    if (hasTypeScript) return "vanilla-ts";
    return "vanilla";
  }, [files]);

  const dependencies = React.useMemo(() => {
    const deps: Record<string, string> = {};

    if (getTemplate === "react" || getTemplate === "react-ts") {
      deps['react'] = "^18.2.0";
      deps['react-dom'] = "^18.2.0";
    }

    if (getTemplate === "react-ts" || getTemplate === "vanilla-ts") {
      deps['typescript'] = "^5.3.3";
      if (getTemplate === "react-ts") {
        deps['@types/react'] = "^18.2.45";
        deps['@types/react-dom'] = "^18.2.18";
      }
    }

    if (files.some(file => file.content.includes('tailwind'))) {
      deps['tailwindcss'] = "^3.4.0";
    }

    return deps;
  }, [files, getTemplate]);

  const entryFile = React.useMemo(() => {
    const possibleEntries = [
      'index.html', 'src/index.html', 'public/index.html',
      'index.js', 'src/index.js',
      'index.jsx', 'src/index.jsx',
      'index.ts', 'src/index.ts',
      'index.tsx', 'src/index.tsx',
      'App.js', 'src/App.js',
      'App.jsx', 'src/App.jsx',
      'App.ts', 'src/App.ts',
      'App.tsx', 'src/App.tsx'
    ];

    for (const entry of possibleEntries) {
      if (files.some(file => file.path === entry || file.path === `/${entry}`)) {
        return entry;
      }
    }

    return files[0]?.path || '/index.html';
  }, [files]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      setError(e.error?.message || 'Error in preview');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (files.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">No files to preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-destructive/10 border-t border-destructive/20 text-destructive text-xs">
          <p className="font-medium">Error in preview:</p>
          <pre className="mt-1 overflow-auto max-h-20">{error}</pre>
        </div>
      )}

      <div className={cn("w-full h-full border-0", error && "h-[calc(100%-6rem)]")}>
        <SandpackProvider
          files={sandpackFiles}
          template={getTemplate}
          theme={githubLight}
          customSetup={{ dependencies }}
          options={{
            activeFile: activeFile || entryFile,
            visibleFiles: Object.keys(sandpackFiles),
            recompileMode: "delayed",
            recompileDelay: 500
          }}
        >
          <SandpackLayout className="h-full">
            <div className="h-full overflow-hidden rounded-md border border-border flex flex-col">
              <div className="flex-1 overflow-auto">
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton
                  className="h-full !min-h-[400px]" // adjust as needed
                  style={{ overflow: 'auto' }}
                />
              </div>
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export default Sandpack;
