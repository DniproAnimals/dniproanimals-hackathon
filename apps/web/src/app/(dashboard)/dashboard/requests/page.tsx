import { RequestsFilters } from "./components/RequestsFilters";
import { RequestsHeader } from "./components/RequestsHeader";
import { RequestsList } from "./components/RequestsList";

export default function RequestsPage() {
  return (
    <div className="max-w-5xl">
      <RequestsHeader />
      <RequestsFilters />
      <RequestsList />
    </div>
  );
}
