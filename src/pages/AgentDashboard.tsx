
// import React from "react";
// import { AgentProvider } from "../contexts/AgentContext";
// import AgentChat from "../components/agentChat";
// import FileBrowser from "../components/FileBrowser";
// import CodeViewer from "../components/CodeViewer";
// import Header from "../components/Header";

// const AgentDashboard: React.FC = () => {
//   return (
//     <AgentProvider>
//       <div className="flex flex-col h-screen">
//         <Header 
//           onNewProject={() => window.location.reload()}
//           onOpenSettings={() => {}} 
//         />
        
//         <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-hidden">
//           <div className="md:col-span-3 h-[500px] md:h-full overflow-hidden">
//             <FileBrowser />
//           </div>
          
//           <div className="md:col-span-5 h-[500px] md:h-full overflow-hidden">
//             <AgentChat />
//           </div>
          
//           <div className="md:col-span-4 h-[500px] md:h-full overflow-hidden">
//             <CodeViewer />
//           </div>
//         </div>
//       </div>
//     </AgentProvider>
//   );
// };

// export default AgentDashboard;


import React from "react";
import { AgentProvider } from "../contexts/AgentContext";
import AgentChat from "../components/agentChat";
import FileBrowser from "../components/FileBrowser";
import CodeViewer from "../components/CodeViewer";
import Header from "../components/Header";

const AgentDashboard: React.FC = () => {
  return (
    <AgentProvider>
      <div className="flex flex-col h-screen">
        <Header 
          onNewProject={() => window.location.reload()}
          onOpenSettings={() => {}} 
        />
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-hidden">
          <div className="md:col-span-4 h-[500px] md:h-full overflow-hidden">
            <AgentChat />
          </div>
          
          <div className="md:col-span-3 h-[500px] md:h-full overflow-hidden">
            <FileBrowser />
          </div>
          
          <div className="md:col-span-5 h-[500px] md:h-full overflow-hidden">
            <CodeViewer />
          </div>
        </div>
      </div>
    </AgentProvider>
  );
};

export default AgentDashboard;
