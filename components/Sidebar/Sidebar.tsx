import { IconFolderPlus, IconMistOff, IconPlus, IconHelp } from '@tabler/icons-react';
import { ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Search from '../Search';
import { KebabMenu } from './components/KebabMenu';
import { SortType } from '@/types/folder';
import HomeContext from '@/pages/api/home/home.context';
import HelpOverlay from '../Help/HelpOverlay';


interface Props<T> {
  isOpen: boolean;
  addItemButtonTitle: string;
  side: 'left' | 'right';
  items: T[];
  itemComponent: ReactNode;
  folderComponent: ReactNode;
  footerComponent?: ReactNode;
  searchTerm: string;
  handleSearchTerm: (searchTerm: string) => void;
  toggleOpen: () => void;
  handleCreateItem: () => void;
  handleCreateFolder: () => void;
  handleDrop: (e: any) => void;
  handleCreateAssistantItem: () => void;
  setFolderSort: (s: SortType) => void;
}

const Sidebar = <T,>({
  isOpen,
  addItemButtonTitle,
  side,
  items,
  itemComponent,
  folderComponent,
  footerComponent,
  searchTerm,
  handleSearchTerm,
  toggleOpen,
  handleCreateItem,
  handleCreateFolder,
  handleDrop,
  handleCreateAssistantItem,
  setFolderSort,
}: Props<T>) => {

  const { state: { messageIsStreaming}} = useContext(HomeContext);
  const { t } = useTranslation('promptbar');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  const addItemButton = (width: string) => ( 
    <div className="flex items-center gap-2">
      <button 
        className="flex flex-shrink-0 items-center justify-center w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
        onClick={() => setIsHelpOpen(true)}
        title="Help"
      >
        ?
      </button>
      <button className={`text-sidebar flex ${width} flex-shrink-0 select-none items-center gap-3 rounded-md border border-[#8B7355] dark:border-[#8B7355] p-2 text-black dark:text-black transition-colors duration-200 
                      ${side === 'left' && messageIsStreaming ? "cursor-not-allowed" : "hover:bg-white/80 cursor-pointer "}`}
                      disabled={side === 'left' && messageIsStreaming}
                      onClick={() => {
                        handleCreateItem();
                        handleSearchTerm('');
                      }}
                      >
                        <IconPlus size={14} />
                        {addItemButtonTitle}
      </button>
    </div>
  );


  const addButtonForSide = (side: string) => {
    if (side === 'left') return addItemButton("w-[160px]")

    const addAssistantButton = (
      <button
        className="text-sidebar flex w-[200px] flex-shrink-0 select-none items-center gap-3 rounded-md border border-[#8B7355] dark:border-[#8B7355] p-2 text-black dark:text-black transition-colors duration-200 hover:bg-white/80 dark:hover:bg-[#8B7355]/10"
        onClick={() => {
          handleCreateAssistantItem();
          handleSearchTerm('');
        }}
      >
        <IconPlus size={16} className="text-black dark:text-black"/>
        {"Assistant"}
      </button>
    );

    return addAssistantButton
  }

  return (
    <>
      <div className={`border-t border-[#D4C5B4]/20 dark:border-[#D4C5B4]/20 overflow-x-hidden h-full `}>
        <div
          className={`fixed top-0 ${side}-0 z-40 flex h-full w-[270px] flex-none flex-col bg-[#F9F5F2]/90 dark:bg-[#8B7355] p-2 text-[14px] transition-all sm:relative sm:top-0 `}
        >
          <div className="flex items-center gap-x-4 mb-3">
            {addButtonForSide(side)}
            <button
              className="mr-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-[#8B7355] dark:border-[#8B7355] px-4 py-3 text-sm text-[#8B7355] dark:text-[#8B7355] transition-colors duration-200 hover:bg-white/80 dark:hover:bg-[#6B563D]"
              onClick={handleCreateFolder}
              title="Create Folder"
            >
              <IconFolderPlus size={16} />
            </button>
          </div>
          {side === 'right' && addItemButton('')}
          <Search
            placeholder={t('Search conversations...')}
            searchTerm={searchTerm}
            onSearch={handleSearchTerm}
            paddingY="py-3"
          />

          <div className="gap-2 flex flex-col">
            <KebabMenu
              label={side === 'left' ? "Conversations": "Prompts"} 
              items={items}
              handleSearchTerm={handleSearchTerm}
              setFolderSort={setFolderSort}
            />
          </div>
          <div className="relative flex-grow overflow-y-auto w-[268px] border-r border-[#D4C5B4]/20 dark:border-[#D4C5B4]/20">
            {items?.length > 0 && (
              <div className="flex border-b border-[#D4C5B4]/20 dark:border-[#D4C5B4]/20 pb-2">
                {folderComponent}
              </div>
            )}

            {items?.length > 0 ? (
              <div
                onDrop={handleDrop}
                onDragOver={allowDrop}
                onDragEnter={highlightDrop}
                onDragLeave={removeHighlight}
              >
                {itemComponent}
              </div>
            ) : (
              <div className="mt-8 select-none text-center dark:text-white opacity-50">
                <IconMistOff className="mx-auto mb-3" />
                <span className="text-[14px] leading-normal">
                  {t('No data.')}
                </span>
              </div>
            )}
          </div>
          {footerComponent}
        </div>
      </div>
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} type={side === 'right' ? 'assistant' : 'sidebar'} />
    </>
  );
};

export default Sidebar;

