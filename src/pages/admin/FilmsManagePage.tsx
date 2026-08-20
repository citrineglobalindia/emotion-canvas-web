import { PageHeader } from "@/components/admin/PageHeader";
import ContentListManager from "@/components/admin/ContentListManager";

/** Manages the tiles on the public /films page. */
const FilmsManagePage = () => (
  <div>
    <PageHeader
      title="Films page"
      description="Everything shown at /films — plus the home page films grid, which appears there automatically. The category you give each film becomes a filter button."
    />
    <ContentListManager
      pageKey="films"
      sectionKey="film"
      itemNoun="film"
      imageLabel="Thumbnail"
      withVideo
      textFields={[
        { column: "heading", label: "Title", placeholder: "Sindhu & Harsha" },
        { column: "subheading", label: "Subtitle", placeholder: "Wedding Film, Ramanagara" },
        { column: "cta_label", label: "Category", placeholder: "Wedding Films" },
      ]}
      emptyHint="No films added yet — the page is showing its built-in samples."
    />
  </div>
);

export default FilmsManagePage;
