import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import React from 'react';

interface Props {
  onClick: any;
  side: 'left' | 'right';
  isDisabled?:boolean;
}

export const CloseSidebarButton = ({ onClick, side, isDisabled}: Props) => {
  return (
    <>
      <button
        className={`absolute ${
          side === 'right' ? 'right-[280px]' : 'left-[280px]'
        } top-[5px] z-50 h-7 w-7 hover:text-[#6B563D] dark:text-[#D4C5B4] dark:hover:text-white sm:h-8 sm:w-8 sm:text-[#8B7355]`}
        onClick={onClick}
        title="Collapse Sidebar"
      >
        {side === 'right' ? <IconArrowBarRight /> : <IconArrowBarLeft />}
      </button>
      <div
        onClick={onClick}
        className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
      ></div>
    </>
  );
};

export const OpenSidebarButton = ({ onClick, side, isDisabled }: Props) => {
  return (
    <button
      className={`absolute ${
        side === 'right' ? 'right-2' : 'left-2'
      } top-[102px] z-50 h-7 w-7 text-[#8B7355] hover:text-[#6B563D] dark:text-[#D4C5B4] dark:hover:text-white sm:h-8 sm:w-8 sm:text-[#8B7355]`}
      onClick={onClick}
      title="Expand Sidebar"
      disabled={isDisabled}
    > 
      { !isDisabled && (side === 'right' ? <IconArrowBarLeft /> : <IconArrowBarRight />)}
    </button>
  );
};
