import React from 'react';
import '../PDetStyle.css';

export type TabType = 'plan' | 'finanse' | 'pack';

interface CloudTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const CloudTabs: React.FC<CloudTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: { id: TabType; label: string }[] = [
        { id: 'plan', label: 'Plan Dnia' },
        { id: 'pack', label: 'Pakowanie' },
        { id: 'finanse', label: 'Finanse' },
    ];

    return (
        <nav className="tabs-nav">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <svg
                        width="110"
                        height="54"
                        viewBox="0 0 138 68"
                        className="cloud-svg"
                    >
                        <path
                            d="M27.1123 67.3002C-18.3877 67.3002 3.26042 18.3001 27.1123 32.3001C4.11228 18.8001 44.1497 -12.1999 54.1123 18.3001C49.6123 4.52355 85.0123 -13.6999 90.6123 18.3002C100.612 -2.69988 137.612 21.3001 112.612 40.3001C131.612 18.3002 156.612 67.3002 112.612 67.3002H27.1123Z"
                            className="cloud-path"
                            strokeWidth="2"
                        />
                    </svg>
                    <span className="cloud-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default CloudTabs;
