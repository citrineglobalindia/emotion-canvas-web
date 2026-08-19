# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## How content works

Everything on the public website is driven by the admin panel at `/admin`, with
the design's original copy as a safety net.

**The rule:** if the database has content for a section, that content is shown.
If it doesn't — or a field is left blank — the site falls back to the copy and
images compiled into the code. The live site can never go blank because a row
was deleted or a field was cleared.

| Admin screen | Drives |
| --- | --- |
| Stories | `/stories` and every `/stories/:slug` page |
| Blog | `/blog` |
| Testimonials | The quotes carousel on the home page |
| Instagram | The Instagram strip on the home page |
| Media | Gallery page and the home photo strip (see *Placing images* below) |
| Site content | All remaining headings, body copy, images, buttons and studio contact details |

### Site content

`bw_site_content` rows are addressed by `page_key` + `section_key`. The full
catalogue of editable sections lives in `src/lib/contentSchema.ts` — that file
is the single source of truth: it renders the admin form (friendly labels, only
the fields a section uses, an image picker where an image is expected) *and*
supplies each component's fallback copy.

To make a new part of the site editable:

1. Add an entry to `CONTENT_SCHEMA` in `src/lib/contentSchema.ts`, including the
   current copy under `defaults`.
2. In the component, read it:

   ```tsx
   const hero = useSection("home", "hero", defaultsFor("home", "hero"));
   ```

The admin screen picks the new section up automatically.

Copy fields support two safe conventions instead of HTML: `*asterisks*` render
as italic accent text, and blank lines split body copy into paragraphs. Nothing
typed into the admin is ever rendered as markup.

### Placing images

Upload in **Admin → Media**, then tag the image to place it:

- `gallery` — appears on the Gallery page
- `home-photos` — appears in the home page photo strip

Any *other* tag on a gallery image becomes a filter category on the Gallery
page, so tagging a photo `gallery, Weddings` puts it under a "Weddings" filter.

## Database

This Supabase project is shared with other products, so every object this site
owns is namespaced `bw_`: tables (`bw_stories`), functions (`bw_has_role`), the
role enum (`bw_app_role`) and the storage bucket (`bw-media-library`).

- `supabase/migrations/` holds a single baseline that reproduces the live schema
  and is safe to re-run.
- `supabase/migrations/_archive_pre_bw_prefix/` holds the original
  Lovable-generated migrations. They created *unprefixed* objects that do not
  exist in the live database and are kept for history only — do not apply them.

After changing the schema, regenerate the TypeScript types so the compiler keeps
catching mistyped table names:

```sh
python3 scripts/gen-types.py
```

## Images and page speed

Photographs are served through Supabase's image transform endpoint, not as the
stored original: `SmartImage` (and `sizedImageUrl` for the few places that need
a bare URL) asks for a copy at roughly the size it will be displayed. A 22MB
camera JPEG shown as a thumbnail becomes about 20KB.

Two rules keep this working:

- **Uploads are downscaled in the browser** to a 2560px longest edge before
  they reach storage (`src/lib/imageResize.ts`). Supabase refuses to generate
  resized copies from very large sources, so an oversized original cannot be
  optimised on delivery — it has to be right at upload time.
- **Already-oversized files** are flagged in Admin → Media with an
  *Optimise* button that re-encodes them in place, keeping the same URL so
  existing references stay valid.

To check a change hasn't made scrolling worse:

```sh
npm run build && npx vite preview --port 4173 &
node scripts/perf.mjs "my change"

# Model what the page will look like once the media library is optimised
# (needs `npm i -D sharp`, which is not a project dependency)
PERF_SIMULATE_OPTIMISED=1 node scripts/perf.mjs "projected"
```

It reports frame times under CPU throttling; `p95 frame time` and
`frames over budget` are the numbers that correspond to visible stutter.

## Checks

```sh
npm run typecheck   # tsc -b — the root tsconfig has "files": [], so plain `tsc` checks nothing
npm run lint
npm test            # vitest
npm run build

# End-to-end smoke test against a built site and the real Supabase project
npm run build && npx vite preview --port 4173 &
node scripts/smoke.mjs
```
