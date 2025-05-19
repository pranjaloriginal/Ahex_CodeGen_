
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, User } from "lucide-react";
import { Plus } from "lucide-react";

interface HeaderProps {
  onNewProject: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onOpenSettings }) => {
  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img 
              src="https://assets.static-upwork.com/org-logo/425273053090574336" 
              alt="Ahex Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-semibold text-lg">Ahex CodeGen</span>
        </div>
        
        <Separator orientation="vertical" className="mx-4 h-6" />
        
        <div className="flex-1 flex items-center">
          <span className="text-sm font-medium">My Project</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onNewProject}>
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
