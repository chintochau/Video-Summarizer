import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DocumentTextIcon  } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HeadingsWithTabs = ({
  setActiveTab,
  activeTab,
  summaries,
  startSummary,
}) => {

  const changeTab = (index) => {
    if (!startSummary) {
      setActiveTab(index);
    }
  };

  return (
    <div className="w-full border-gray-200 border-b">
      <div className="sm:hidden flex items-center gap-x-2 px-3  pb-1">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <DocumentTextIcon className="w-6 h-6 text-primary"/>
        <Select
          onValueChange={(e) => setActiveTab(e) }
          defaultValue={0}
        >
          <SelectTrigger>
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
          {summaries.map((summary, index) => (
            <SelectItem key={index} value={index}>
              {summary.summaryType}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>
      <div className="hidden sm:block px-2">
          <nav className="-mb-px flex space-x-4 flex-wrap" aria-label="Tabs">
            {summaries.map((summary, index) => (
              <a
                key={index}
                onClick={() => changeTab(index)}
                className={classNames(
                  activeTab === index
                    ? "border-primary/80 text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 py-1.5 px-1 text-sm font-medium cursor-pointer"
                )}
                aria-current={activeTab === index ? "page" : undefined}
              >
                {summary.summaryType}
              </a>
            ))}
          </nav>
      </div>
    </div>
  );
};

export default HeadingsWithTabs;
