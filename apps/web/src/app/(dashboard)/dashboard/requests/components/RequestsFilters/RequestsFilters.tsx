import { RequestsSearchField } from "./components/RequestsSearchField";
import { RequestsStatusTabs } from "./components/RequestsStatusTabs";

export function RequestsFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <RequestsSearchField />
      <RequestsStatusTabs />
    </div>
  );
}
