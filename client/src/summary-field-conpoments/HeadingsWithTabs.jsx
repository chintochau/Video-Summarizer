import React from "react";

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
    <div className="w-full">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={summaries[activeTab].name}
          onChange={(e) => changeTab(e.target.value)}
        >
          {summaries.map((summary, index) => (
            <option key={index} value={index}>
              {summary.summaryType}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 flex-wrap" aria-label="Tabs">
            {summaries.map((summary, index) => (
              <a
                key={index}
                onClick={() => changeTab(index)}
                className={classNames(
                  activeTab === index
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium cursor-pointer"
                )}
                aria-current={activeTab === index ? "page" : undefined}
              >
                {summary.summaryType}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeadingsWithTabs;
