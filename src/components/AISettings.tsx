
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AISettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AISettings: React.FC<AISettingsProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>AI Agent Settings</DialogTitle>
          <DialogDescription>
            Configure LangGraph and OpenAI integration settings.
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-4" />
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">AI Model</h3>
            <RadioGroup defaultValue="gpt-4o-mini">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gpt-4o-mini" id="gpt-4o-mini" />
                <Label htmlFor="gpt-4o-mini">GPT-4o-mini</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gpt-4.1" id="gpt-4.1" />
                <Label htmlFor="gpt-4.1">GPT-4.1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="claude" id="claude" />
                <Label htmlFor="claude">Claude</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Temperature</h3>
              <span className="text-sm text-muted-foreground">0.7</span>
            </div>
            <Slider defaultValue={[0.7]} max={1} step={0.1} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input id="api-key" type="password" placeholder="sk-..." />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">LangGraph Agent Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-memory">Enable Memory</Label>
                <p className="text-xs text-muted-foreground">Store conversation history</p>
              </div>
              <Switch id="enable-memory" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-tools">Enable Python Tools</Label>
                <p className="text-xs text-muted-foreground">Allow code execution</p>
              </div>
              <Switch id="enable-tools" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISettings;
