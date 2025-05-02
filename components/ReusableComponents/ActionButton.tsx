import { MouseEventHandler, ReactNode } from 'react';

interface Props {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  title?: string;
  className?: string;
}

const ActionButton = ({ handleClick, children, title, className }: Props) => {
  return (
    <button
      className={`min-w-[20px] p-1 ${className ?? 'text-[#8B7355] dark:text-[#D4C5B4]'}`}
      onClick={handleClick}
      title={title}
    >
      {children}
    </button>
  );
};

export default ActionButton;
