import {
  IconCheck,
  IconMessage,
  IconPencil,
  IconTrash,
  IconX,
  IconCloudFilled,
  IconCloud
} from '@tabler/icons-react';
import {
  DragEvent,
  KeyboardEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Conversation } from '@/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import ChatbarContext from '@/components/Chatbar/Chatbar.context';
import { uploadConversation } from '@/services/remoteConversationService';
import { isLocalConversation, isRemoteConversation } from '@/utils/app/conversation';
import ActionButton from '@/components/ReusableComponents/ActionButton';

interface Props {
  conversation: Conversation;
}

export const ConversationComponent = ({ conversation}: Props) => {
  const {
    state: { selectedConversation, messageIsStreaming, artifactIsStreaming, checkingItemType, checkedItems, folders},
    handleSelectConversation,
    handleUpdateConversation,
    dispatch: homeDispatch
  } = useContext(HomeContext);

  const foldersRef = useRef(folders);

  useEffect(() => {
      foldersRef.current = folders;
  }, [folders]);

  const { handleDeleteConversation } = useContext(ChatbarContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [checkConversations, setCheckConversations] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    if (selectedConversation?.id === conversation.id) {
      // Wait a tick (or 100ms) to ensure the folder is open and DOM has updated
      const timeoutId = setTimeout(() => {
        if (conversationRef.current && !isInViewport(conversationRef.current)) {
          conversationRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        } 
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedConversation]);

  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectedConversation && handleRename(selectedConversation);
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLButtonElement>,
    conversation: Conversation,
  ) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('conversation', JSON.stringify(conversation));
    }
  };

  const handleRename = async (conversation: Conversation) => {
    if (renameValue.trim().length > 0) {
      handleUpdateConversation(conversation, {
        key: 'name',
        value: renameValue,
      });
      // you can only rename a conversation that is the cur selected conversation. this is where we have the updated conversation
      if (isRemoteConversation(conversation) && selectedConversation) {
        const renamedSelected = {...selectedConversation, name: renameValue};
        homeDispatch({field: 'selectedConversation', value: renamedSelected});
        uploadConversation(renamedSelected, foldersRef.current);
      }
      setRenameValue('');
      setIsRenaming(false);
    }
  };

  const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (isDeleting) {
      handleDeleteConversation(conversation);
    } else if (isRenaming) {
      handleRename(conversation);
    }
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    selectedConversation && setRenameValue(selectedConversation.name);
  };
  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  useEffect(() => {
    if (checkingItemType === 'Conversations') setCheckConversations(true);
    if (checkingItemType === null) setCheckConversations(false);
  }, [checkingItemType]);


  useEffect(() => {
    setIsChecked((checkedItems.includes(prompt) ? true : false)); 
  }, [checkedItems]);

  const handleCheckboxChange = (checked: boolean) => {
    if (checked){
      homeDispatch({field: 'checkedItems', value: [...checkedItems, conversation]}); 
    } else {
      homeDispatch({field: 'checkedItems', value: checkedItems.filter((i:any) => i !== conversation)});
    }
  }

  function isInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  

  return (
    <div ref={conversationRef} className="relative flex items-center">
      {isRenaming && selectedConversation?.id === conversation.id ? (
        <div className="flex w-full items-center gap-3 rounded-lg bg-[#F9F5F2] dark:bg-[#8B7355]/10 p-3">
          <div className="text-[#8B7355] dark:text-[#D4C5B4]">
            {isLocalConversation(conversation) ? <IconMessage size={18} /> 
                                             :  <div>
                                                  <IconCloud className="block dark:hidden" size={18} />
                                                  <IconCloudFilled className="hidden dark:block" size={18} />
                                                </div>}
          </div>
          <input
            className="mr-12 flex-1 ml-[-8px] overflow-hidden overflow-ellipsis border-[#8B7355] bg-transparent text-left text-[12.5px] leading-3 text-[#8B7355] dark:text-[#D4C5B4] outline-none focus:border-[#8B7355]"
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleEnterDown}
            autoFocus
          />

          <div className="absolute right-1 flex">
            <ActionButton
              handleClick={handleConfirm}
              className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
            >
              <IconCheck size={18} />
            </ActionButton>

            <ActionButton
              handleClick={handleCancel}
              className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
            >
              <IconX size={18} />
            </ActionButton>
          </div>
        </div>
      ) : (
        <button
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#F9F5F2] dark:hover:bg-[#8B7355]/10 ${
            messageIsStreaming || artifactIsStreaming? 'disabled:cursor-not-allowed' : ''
          } ${
            selectedConversation?.id === conversation.id
              ? 'bg-[#F9F5F2] dark:bg-[#8B7355]/10'
              : ''
          }`}
          onClick={() => handleSelectConversation(conversation)}
          disabled={messageIsStreaming || artifactIsStreaming}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, conversation)}
          title="View Conversation"
        >
          <div className="text-[#8B7355] dark:text-[#D4C5B4]">
            {isLocalConversation(conversation) ? <IconMessage size={18} /> 
                                             :  <div>
                                                  <IconCloud className="block dark:hidden" size={18} />
                                                  <IconCloudFilled className="hidden dark:block" size={18} />
                                                </div>}
          </div>

          <div className="relative flex-1 text-left text-[12.5px] leading-[1.4] py-1 !text-black dark:!text-black overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px]">
            {conversation.name}
          </div>

          {(isDeleting || isRenaming) ? (
            <div className="absolute right-1 flex">
              <ActionButton
                handleClick={handleConfirm}
                className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
              >
                <IconCheck size={18} />
              </ActionButton>

              <ActionButton
                handleClick={handleCancel}
                className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
              >
                <IconX size={18} />
              </ActionButton>
            </div>
          ) : (
            <div className="absolute right-1 flex">
              <ActionButton
                handleClick={handleOpenRenameModal}
                title="Rename Conversation"
                className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
              >
                <IconPencil size={18} />
              </ActionButton>

              <ActionButton
                handleClick={handleOpenDeleteModal}
                title="Delete Conversation"
                className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
              >
                <IconTrash size={18} />
              </ActionButton>
            </div>
          )}
        </button>
      )}

      { checkConversations &&  (
        <div className="relative flex items-center">
          <div key={conversation.id} className="absolute right-4 z-10">
              <input
              type="checkbox"
              checked={checkedItems.includes(conversation)}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
          </div>
        </div>
      )}  
    </div>
  );
};
