import { FC, useEffect, useRef, useState } from "react";

export interface tab {
    label: string;
    title?: string;
    content: React.ReactElement;
}


interface Props {
    tabs: tab[];
    width?: () => number;
}


export const ActiveTabs: FC<Props> = ({tabs, width}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const tabRef = useRef<HTMLDivElement>(null); 


    const getInnerWindowSize = () => {
        return width ? width() : window.innerWidth;
       }

       const [innerWidth, setInnerWidth] = useState<number>(getInnerWindowSize());

    useEffect(() => {
        const updateInnerWindow = () => {
            setInnerWidth(getInnerWindowSize());
        }
        // Listen to window resize to update the size
        window.addEventListener('resize', updateInnerWindow);
        return () => {
          window.removeEventListener('resize', updateInnerWindow);
        };
      }, []);
    

    if (tabs && tabs.length === 0 ) return <></>;
    return ( 
        <div ref={tabRef} className="flex flex-col gap-2"
        style={{width: innerWidth}}>
            <div className="z-50 fixed flex flex-row gap-1 rounded-t border-b border-[#8B7355] bg-white"
              style={{width: innerWidth * 0.98, overflowY: 'auto'}}>
                    {tabs.map((tab: tab, index: number) => 
                        <button
                            title={tab.title}
                            key={index}
                            onClick={() => {
                                setActiveTab(index);
                                if (tabRef && tabRef.current) tabRef.current.scrollIntoView({ block: 'start' });
                            }}
                            className={`p-2 rounded-t flex flex-shrink-0 ${activeTab === index ? 'border-l border-t border-r border-[#8B7355] text-[#B91C1C] bg-white' : 'text-[#8B7355] bg-white'}`}>
                            <h3 className="text-xl">{tab.label}</h3> 
                        </button>
                    
                    )}
                    
            </div>
            <br className="mt-[40px]"></br>
                        
            <div className="mt-8"> {tabs[activeTab].content} </div>

        </div>

       
    )
}