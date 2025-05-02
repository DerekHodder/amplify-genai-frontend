import React, { useState, useEffect, ReactNode, useContext, useRef } from 'react';
import { CloseSidebarButton, OpenSidebarButton } from "@/components/Sidebar/components/OpenCloseButton";
import HomeContext from '@/pages/api/home/home.context';
import { AssistantAdminUI } from '../Admin/AssistantAdminUI';
import { AdminUI } from '../Admin/AdminUI';

interface TabProps {
    icon: ReactNode;
    children: ReactNode;
    title?: string;
}

export const Tab: React.FC<TabProps> = ({ icon, children }) => (
    <>{children}</>
)

interface TabSidebarProps {
    side: 'left' | 'right';
    children: (React.ReactElement<TabProps> | null)[] | React.ReactElement<TabProps> | null;
    footerComponent?: ReactNode;
}

// detect mobile browser
const isMobileBrowser = () => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

export const TabSidebar: React.FC<TabSidebarProps> = ({ side, children, footerComponent }) => {
    const { state: { featureFlags }, dispatch: homeDispatch } = useContext(HomeContext);
    const featureFlagsRef = useRef(featureFlags);

    useEffect(() => {
        featureFlagsRef.current = featureFlags;
        window.dispatchEvent(new Event('updateFeatureSettings'));
    }, [featureFlags]);

    const [activeTab, setActiveTab] = useState(0);
    // Set the initial state based on whether the user is on a mobile browser
    const [isOpen, setIsOpen] = useState(!isMobileBrowser());
    const [showAssistantAdmin, setShowAssistantAdmin] = useState<boolean>(false);
    const [showAdminInterface, setShowAdminInterface] = useState<boolean>(false);

    const [isArtifactsOpen, setIsArtifactsOpen] = useState<boolean>(false);
    const [groupModalData, setGroupModalData] = useState<any>(undefined);

    const childrenArray = React.Children.toArray(children) 
                                        .filter((child): child is React.ReactElement<TabProps> => 
                                            React.isValidElement(child) && child !== null
                                        ); 
    const chatSide = () => side === 'left';

    const toggleOpen = () => {
        const updateIsOpen = !isOpen;
        setIsOpen(updateIsOpen);
        homeDispatch({ field: chatSide() ? 'showChatbar' : 'showPromptbar', 
                       value: updateIsOpen });
    }

    const isMultipleTabs = childrenArray.length > 1;

    const handleAdmin = (isOpen: boolean) => {
        if (isOpen && isArtifactsOpen) window.dispatchEvent(new CustomEvent('openArtifactsTrigger', { detail: { isOpen: false }} ));
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handleAstAdminEvent = (event:any) => {
            if (!featureFlagsRef.current.assistantAdminInterface) return;
            const isAdminOpen = event.detail.isOpen;
            handleAdmin(isAdminOpen);
            setGroupModalData(event.detail.data);
            setShowAssistantAdmin(isAdminOpen);  
        };

        const handleAdminEvent = (event:any) => {
            if (!featureFlagsRef.current.adminInterface) return;
            const isAdminOpen = event.detail.isOpen;
            handleAdmin(isAdminOpen);
            setShowAdminInterface(isAdminOpen);  
        };

        const handleArtifactEvent = (event:any) => {
            const isArtifactsOpen = event.detail.isOpen;
            setIsOpen(!isArtifactsOpen);
            setIsArtifactsOpen(isArtifactsOpen);
        };

        const handleTabSwitchEvent = (event:any) => {
            if (isMultipleTabs) {
                const eventSide = event.detail.side;
                if (side === eventSide && !isOpen) setIsOpen(true);
                if (eventSide === 'right' && isArtifactsOpen) setIsArtifactsOpen(false);
                
                const switchToIndex = childrenArray.findIndex(
                    (child) => child.props.title === event.detail.tab
                );
                setActiveTab(switchToIndex);
            }
        };

        window.addEventListener('openAstAdminInterfaceTrigger', handleAstAdminEvent);
        window.addEventListener('openAdminInterfaceTrigger', handleAdminEvent);
        window.addEventListener('openArtifactsTrigger', handleArtifactEvent);
        window.addEventListener('homeChatBarTabSwitch', handleTabSwitchEvent);

        return () => {
            window.removeEventListener('openAstAdminInterfaceTrigger', handleAstAdminEvent);
            window.removeEventListener('openAdminInterfaceTrigger', handleAdminEvent);
            window.removeEventListener('openArtifactsTrigger', handleArtifactEvent);
            window.removeEventListener('homeChatBarTabSwitch', handleTabSwitchEvent);

        };
    }, []);

    
    useEffect(() => {
        if ( isOpen) setShowAssistantAdmin(false);
    }, [isOpen]);


    return isOpen ? (
        
        <div className={`fixed top-0 ${side}-0 flex h-full w-[280px] flex-none ${chatSide()? 'border-r border-[#8B7355]/20 dark:border-r-[#8B7355]/20' : 'border-l border-[#8B7355]/20 dark:border-l-[#8B7355]/20'} flex-col space-y-0 bg-[#F9F5F2]/90 dark:bg-[#8B7355]/10 text-[14px] sm:relative sm:top-0`} 
            style={{
                zIndex: '20 !important'
              }}>
            {isMultipleTabs && (
                <>
                  <div className="flex flex-row !m-0 !p-0 w-full bg-[#F9F5F2]/90 dark:bg-[#8B7355]/10">
                    {childrenArray.map((child, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`px-3 py-2 !m-0 ${
                                activeTab === index
                                    ? '!border !border-[#8B7355]/20 dark:!border-[#8B7355]/20 !border-b-0 !rounded-t-lg !bg-[#F9F5F2]/90 dark:!bg-[#8B7355]/10'
                                    : 'opacity-50 hover:opacity-100'
                            }`}
                        >
                            <div className="text-[#8B7355] dark:text-[#8B7355]">
                                {child.props.icon}
                            </div>
                        </button>
                    ))}
                  </div>
                  <div className="w-full border-b border-[#D4C5B4]/20 dark:border-[#D4C5B4]/20"></div>
                </>
            )}
            <div className="overflow-auto !bg-[#F9F5F2]/90 dark:!bg-[#8B7355]/10 !p-0 !m-0 flex-grow">
                {childrenArray[activeTab].props.children}
            </div>
            <div className="w-full mt-auto !p-0 bg-transparent border-0 shadow-none">
                {footerComponent}
            </div>
            <CloseSidebarButton onClick={toggleOpen} side={side} />
        </div>
    ) : (
        //if we are going to use collapse side bars, interface takes up whole page, we can list the item here 
        <>
        {(isArtifactsOpen && chatSide() || !isArtifactsOpen) && <OpenSidebarButton onClick={toggleOpen} side={side} isDisabled={showAssistantAdmin || showAdminInterface}/>}
        
        {featureFlagsRef.current.assistantAdminInterface && 
         <AssistantAdminUI
            open={showAssistantAdmin && chatSide()}
            openToGroup={groupModalData?.group}
            openToAssistant={groupModalData?.assistant}
        /> }

        {featureFlagsRef.current.adminInterface && 
        <AdminUI
            open={showAdminInterface && chatSide()}
            onClose={() => {
                window.dispatchEvent(new CustomEvent('openAdminInterfaceTrigger', { detail: { isOpen: false }} ));
            }  }
        />}
        </>
        
    );
};


// Usage:
// <TabSidebar side='left' footerComponent={YourFooterComponent}>
//   <Tab icon={<YourIcon1 />}>Content for Tab 1</Tab>
//   <Tab icon={<YourIcon2 />}>Content for Tab 2</Tab>
// </TabSidebar>