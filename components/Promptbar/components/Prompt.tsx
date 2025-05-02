import {
    IconEdit,
    IconCopy,
    IconCheck,
    IconApiApp,
    IconMessage2,
    IconTrash,
    IconX,
    IconRobot,
    IconShare,
    IconEye,
} from '@tabler/icons-react';
import {
    DragEvent,
    MouseEventHandler,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import HomeContext from '@/pages/api/home/home.context';

import { Prompt } from '@/types/prompt';


import PromptbarContext from '../PromptBar.context';
import { PromptModal } from './PromptModal';
import { v4 as uuidv4 } from "uuid";
import {
    handleStartConversationWithPrompt,
} from "@/utils/app/prompts";
import { useSession } from "next-auth/react";
import {getAssistant, handleUpdateAssistantPrompt, isAssistant} from "@/utils/app/assistants";
import {AssistantModal} from "@/components/Promptbar/components/AssistantModal";
import {deleteAssistant} from "@/services/assistantService";
import { ReservedTags } from '@/types/tags';
import { DEFAULT_ASSISTANT } from '@/types/assistant';
import { Group } from '@/types/groups';
import React from 'react';
import ActionButton from '@/components/ReusableComponents/ActionButton';
import { isBasePrompt } from '@/utils/app/basePrompts';

interface Props {
    prompt: Prompt;
}

export const PromptComponent = ({ prompt }: Props) => {
    const {
        dispatch: promptDispatch,
        handleAddPrompt,
        handleUpdatePrompt,
        handleDeletePrompt,
        handleSharePrompt,
    } = useContext(PromptbarContext);

    const {
        state: { statsService, selectedAssistant, checkingItemType, checkedItems, prompts, groups, syncingPrompts, featureFlags},
        dispatch: homeDispatch,
        handleNewConversation,
        setLoadingMessage,
    } = useContext(HomeContext);

    const promptsRef = useRef(prompts);

    useEffect(() => {
        promptsRef.current = prompts;
      }, [prompts]);

    const { data: session } = useSession();
    const user = session?.user;
    // const isReserved = (isAssistant(prompt) && prompt?.data?.assistant?.definition?.tags?.includes(ReservedTags.SYSTEM));
    const isBase = isBasePrompt(prompt.id);
    const groupId = prompt.groupId;
    const canDelete = (!prompt.data || !prompt.data.noDelete) && !groupId;
    const canEdit = (!prompt.data || !prompt.data.noEdit);
    const canCopy = (!prompt.data || !prompt.data.noCopy) && !groupId;
    const canShare = (!prompt.data || !prompt.data.noShare)  && !groupId;

    const [showModal, setShowModal] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [checkPrompts, setCheckPrompts] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleStartConversation = (startPrompt: Prompt) => {

        if(isAssistant(startPrompt) && startPrompt.data){
            homeDispatch({field: 'selectedAssistant', value: startPrompt.data.assistant});
        }


        statsService.startConversationEvent(startPrompt);
        handleStartConversationWithPrompt(handleNewConversation, promptsRef.current, startPrompt);

    }

    useEffect(() => {
        if (checkingItemType === 'Prompts') setCheckPrompts(true);
        if (checkingItemType === null) setCheckPrompts(false);
      }, [checkingItemType]);

    const handleUpdate = (prompt: Prompt) => {
        handleUpdatePrompt(prompt);
        promptDispatch({ field: 'searchTerm', value: '' });
    };

    const handleDelete: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.stopPropagation();

        if (isDeleting) {
            handleDeletePrompt(prompt);
            promptDispatch({ field: 'searchTerm', value: '' });
        }

        if (selectedAssistant && prompt?.data?.assistant?.definition.assistantId === selectedAssistant.definition.assistantId) homeDispatch({ field: 'selectedAssistant', value: DEFAULT_ASSISTANT }); 
        
        if(isAssistant(prompt) && canDelete ){
           const assistant = getAssistant(prompt);
           if(assistant && assistant.assistantId){
               setLoadingMessage("Deleting assistant...");
               try {
                   const result = await deleteAssistant(assistant.assistantId);
                   if(!result){
                       setLoadingMessage("");
                       alert("Failed to delete assistant. Please try again.");
                       return;
                   }
               } catch (e) {
                   setLoadingMessage("");
                   alert("Failed to delete assistant. Please try again.");
                   return;
               }
               setLoadingMessage("");
           }
        }

        setIsDeleting(false);
    };

    const handleCancelDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setIsDeleting(false);
    };

    const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setIsDeleting(true);
    };

    const handleDragStart = (e: DragEvent<HTMLButtonElement>, prompt: Prompt) => {
        if (e.dataTransfer) {
            e.dataTransfer.setData('prompt', JSON.stringify(prompt));
        }
    };

    const handleCopy = () => {
        const newPrompt = { ...prompt, id: uuidv4(), name: prompt.name + ' (copy)' };
        if (isBase) newPrompt.folderId = null;
        
        handleAddPrompt(newPrompt);
    }

    const getIcon = (prompt: Prompt) => {
        if (prompt.data && prompt.data.assistant) {
            return (<IconRobot size={18} />);
        }
        else if (prompt.type === "automation") {
            return (<IconApiApp size={18} />);
        }
        else {
            return (<IconMessage2 size={18} />);
        }
    }


    useEffect(() => {
        if (isRenaming) {
            setIsDeleting(false);
        } else if (isDeleting) {
            setIsRenaming(false);
        }
    }, [isRenaming, isDeleting]);

    useEffect(() => {
        setIsChecked((checkedItems.includes(prompt) ? true : false)); 
    }, [checkedItems]);

    const handleCheckboxChange = (checked: boolean) => {
        if (checked){
          homeDispatch({field: 'checkedItems', value: [...checkedItems, prompt]}); 
        } else {
          homeDispatch({field: 'checkedItems', value: checkedItems.filter((i:any) => i !== prompt)});
        }
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <div className="relative flex items-center mb-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex flex-row items-center w-full">
                    <div className="text-[#8B7355] dark:text-[#D4C5B4]">
                        {getIcon(prompt)}
                    </div>
                    <div className="flex-1 ml-2 truncate overflow-hidden whitespace-nowrap text-ellipsis text-left text-[12.5px] leading-3 !text-black dark:!text-black">
                        {prompt.name}
                    </div>
                </div>
                {(isHovered || isDeleting) && (
                    <div className="flex flex-row gap-2 mt-2 min-h-[24px] w-full">
                        {!isDeleting && (
                            <>
                                {canEdit && (
                                    <ActionButton
                                        handleClick={(e) => {
                                            e.stopPropagation();
                                            setShowModal(true);
                                        }}
                                        title="Edit"
                                        className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                    >
                                        <IconEdit size={18} />
                                    </ActionButton>
                                )}

                                {canCopy && (
                                    <ActionButton
                                        handleClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy();
                                        }}
                                        title="Copy"
                                        className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                    >
                                        <IconCopy size={18} />
                                    </ActionButton>
                                )}

                                {canShare && (
                                    <ActionButton
                                        handleClick={(e) => {
                                            e.stopPropagation();
                                            handleSharePrompt(prompt);
                                        }}
                                        title="Share"
                                        className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                    >
                                        <IconShare size={18} />
                                    </ActionButton>
                                )}

                                <ActionButton
                                    handleClick={(e) => {
                                        e.stopPropagation();
                                        handleStartConversation(prompt);
                                    }}
                                    title="Start Conversation"
                                    className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                >
                                    <IconEye size={18} />
                                </ActionButton>

                                {canDelete && (
                                    <ActionButton
                                        handleClick={handleOpenDeleteModal}
                                        title="Delete"
                                        className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                    >
                                        <IconTrash size={18} />
                                    </ActionButton>
                                )}
                            </>
                        )}
                        {isDeleting && (
                            <>
                                <ActionButton
                                    handleClick={handleDelete}
                                    className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                >
                                    <IconCheck size={18} />
                                </ActionButton>
                                <ActionButton
                                    handleClick={handleCancelDelete}
                                    className="text-[#8B7355] dark:text-[#D4C5B4] hover:text-[#8B7355]/70 dark:hover:text-[#D4C5B4]/70"
                                >
                                    <IconX size={18} />
                                </ActionButton>
                            </>
                        )}
                    </div>
                )}
            </div>

            {checkPrompts && (
                <div className="absolute right-4 z-10">
                    <input
                        type="checkbox"
                        checked={checkedItems.includes(prompt)}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        className="accent-[#8B7355] dark:accent-[#D4C5B4]"
                    />
                </div>
            )}

            {showModal && (
                isAssistant(prompt) ? (
                    <AssistantModal
                        assistant={prompt}
                        onCancel={() => setShowModal(false)}
                        onSave={() => setShowModal(false)}
                        onUpdateAssistant={handleUpdate}
                        loadingMessage="Updating assistant..."
                        loc="edit_assistant"
                        disableEdit={!canEdit}
                    />
                ) : (
                    <PromptModal
                        prompt={prompt}
                        onCancel={() => setShowModal(false)}
                        onSave={() => setShowModal(false)}
                        onUpdatePrompt={handleUpdate}
                    />
                )
            )}
        </div>
    );
};
