import { IconInfoCircle } from '@tabler/icons-react';
import { FC, ReactElement } from 'react';

interface Props {
  content: ReactElement;
  size?: number;
  className?: string;
}

export const InfoBox: FC<Props> = ({content, size=16, className=''}) => {
  return (
    <div
      className={`relative flex items-center rounded-lg !bg-[#F5EEE6] p-4 !text-[#8B7355] dark:!bg-[#2A2B32] dark:!text-[#D4C5B4] ${className}`}
    >
      <IconInfoCircle 
        size={size} 
        className='ml-1 mb-1 flex-shrink-0 !text-[#8B7355] dark:!text-[#D4C5B4]' 
      />
      <div className="ml-2">
        {content}
      </div>
    </div>
  );
}