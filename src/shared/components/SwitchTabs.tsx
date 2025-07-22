import React from 'react';

interface Tab {
    id: string;
    title: string;
}

interface SwitchTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

const SwitchTabs: React.FC<SwitchTabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = ''
}) => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const tabWidth = 100 / tabs.length;

    return (
        <div className={`relative w-full h-10 bg-[#D6E6F8] rounded-[15px] border border-[#666666] overflow-hidden hover:bg-gray-100 ${className}`}>
            {/* Active tab indicator with animation */}
            <div
                className={`absolute h-full bg-[#3E5EF5] rounded-[15px] border border-[#666666] transition-all duration-300 ease-out`}
                style={{
                    width: `${tabWidth}%`,
                    left: `${activeIndex * tabWidth}%`
                }}
            />

            <div className="relative flex h-full">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex-1 h-full font-semibold text-sm md:text-base 
                            transition-colors duration-200 z-10
                            ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-[#020F1E] hover:bg-gray-100 rounded-[15px]'
                            }
                        `}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SwitchTabs;