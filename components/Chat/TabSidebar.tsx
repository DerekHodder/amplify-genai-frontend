import React, { useState } from 'react';
import { IconMessage2, IconBrain, IconSettings } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const TabSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'prompt' | 'settings'>('chat');

  return (
    <div className="flex flex-col gap-2">
      <button
        className={cn(
          'flex w-full items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#F9F5F2] dark:hover:bg-[#F9F5F2]/10',
          {
            'bg-[#F9F5F2] text-[#8B7355] dark:bg-[#F9F5F2]/10': activeTab === 'chat',
          },
        )}
        onClick={() => setActiveTab('chat')}
      >
        <IconMessage2 size={16} className="text-[#8B7355]" />
        Chat
      </button>

      <button
        className={cn(
          'flex w-full items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#F9F5F2] dark:hover:bg-[#F9F5F2]/10',
          {
            'bg-[#F9F5F2] text-[#8B7355] dark:bg-[#F9F5F2]/10': activeTab === 'prompt',
          },
        )}
        onClick={() => setActiveTab('prompt')}
      >
        <IconBrain size={16} className="text-[#8B7355]" />
        Prompt
      </button>

      <button
        className={cn(
          'flex w-full items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#F9F5F2] dark:hover:bg-[#F9F5F2]/10',
          {
            'bg-[#F9F5F2] text-[#8B7355] dark:bg-[#F9F5F2]/10': activeTab === 'settings',
          },
        )}
        onClick={() => setActiveTab('settings')}
      >
        <IconSettings size={16} className="text-[#8B7355]" />
        Settings
      </button>
    </div>
  );
};

export default TabSidebar; 