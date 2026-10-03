import React from 'react';
import { Outlet } from 'react-router-dom';
import InsightsHeader from '../../components/common/InsightsHeader';
import InsightsSecondaryNav from '../../components/common/InsightsSecondaryNav';

export default function InsightsLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Meta Business Suite Style Insights Header */}
      <InsightsHeader />

      {/* Main 2-Column Body: Secondary Navigation (210px) + Broad Content Area */}
      <div className="flex-1 flex min-w-0">
        <InsightsSecondaryNav />
        <div className="flex-1 p-5 lg:p-6 min-w-0 max-w-[1440px] overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
