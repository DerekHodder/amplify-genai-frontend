import { ReactNode } from 'react';

interface Props {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

export const SidebarButton = ({ text, icon, onClick }: Props) => {
  return (
    <button
      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md border border-[#8B7355]/20 p-3 text-black transition-colors duration-200 hover:bg-[#F9F5F2] dark:border-[#8B7355]/20 dark:text-black dark:hover:bg-[#8B7355]/10"
      onClick={onClick}
    >
      {icon}
      <span className="text-[12.5px] leading-3">{text}</span>
    </button>
  );
};
