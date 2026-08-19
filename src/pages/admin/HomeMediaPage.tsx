import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/admin/PageHeader";
import ContentListManager from "@/components/admin/ContentListManager";

/** Manages the two media strips on the home page. */
const HomeMediaPage = () => (
  <div>
    <PageHeader
      title="Home page"
      description="The films grid and the photo strip that visitors see on the home page."
    />
    <Tabs defaultValue="films">
      <TabsList>
        <TabsTrigger value="films">Films grid</TabsTrigger>
        <TabsTrigger value="photos">Photo strip</TabsTrigger>
      </TabsList>

      <TabsContent value="films" className="mt-4">
        <p className="mb-4 text-sm text-muted-foreground">
          The tiles under <em>“every frame tells a story”</em>. Each needs a picture; add a video and
          the tile gets a play button that opens it.
        </p>
        <ContentListManager
          pageKey="home"
          sectionKey="film"
          itemNoun="film"
          imageLabel="Thumbnail"
          withVideo
          textFields={[
            { column: "heading", label: "Title", placeholder: "Sindhu & Harsha" },
            { column: "subheading", label: "Location", placeholder: "Ramanagara" },
          ]}
          emptyHint="No films added yet — the site is showing its built-in samples."
        />
      </TabsContent>

      <TabsContent value="photos" className="mt-4">
        <p className="mb-4 text-sm text-muted-foreground">
          The full-width band of photographs further down the page.
        </p>
        <ContentListManager
          pageKey="home"
          sectionKey="photo"
          itemNoun="photo"
          imageLabel="Photograph"
          textFields={[
            {
              column: "heading",
              label: "Description",
              placeholder: "Bride getting ready (helps screen readers)",
            },
          ]}
          emptyHint="No photographs added yet — the site is showing its built-in samples."
        />
      </TabsContent>
    </Tabs>
  </div>
);

export default HomeMediaPage;
