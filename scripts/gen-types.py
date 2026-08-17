#!/usr/bin/env python3
"""Regenerate src/integrations/supabase/types.ts for the bw_* tables.

The live Supabase project is shared by several apps, so this site's tables are
namespaced with a `bw_` prefix. `supabase gen types` would emit all ~78 tables
in the project; this script emits only the ones this app owns, keeping the
generated file readable and the compiler honest about table names.

Schema snapshot lives in SCHEMA below (pulled from information_schema).
"""
import json
import pathlib

TS = {
    "uuid": "string",
    "text": "string",
    "bool": "boolean",
    "int4": "number",
    "int8": "number",
    "timestamptz": "string",
    "jsonb": "Json",
    "_text": "string[]",
    "bw_app_role": 'Database["public"]["Enums"]["bw_app_role"]',
}

# (name, nullable, has_default)
SCHEMA = {
    "bw_blog_posts": [
        ("id", "uuid", False, True), ("title", "text", False, False),
        ("slug", "text", False, False), ("excerpt", "text", True, False),
        ("content", "text", True, False), ("image_url", "text", True, False),
        ("category", "text", False, True), ("read_time", "text", True, True),
        ("published", "bool", False, True), ("published_at", "timestamptz", True, False),
        ("created_at", "timestamptz", False, True), ("updated_at", "timestamptz", False, True),
    ],
    "bw_chat_events": [
        ("id", "uuid", False, True), ("event_type", "text", False, False),
        ("message", "text", True, False), ("path", "text", True, False),
        ("read", "bool", False, True), ("created_at", "timestamptz", False, True),
    ],
    "bw_contact_submissions": [
        ("id", "uuid", False, True), ("name", "text", False, False),
        ("email", "text", False, False), ("phone", "text", True, False),
        ("message", "text", True, False), ("created_at", "timestamptz", False, True),
        ("location", "text", True, False), ("service", "text", True, False),
        ("status", "text", False, True), ("notes", "text", True, False),
        ("responded_at", "timestamptz", True, False),
    ],
    "bw_media_assets": [
        ("id", "uuid", False, True), ("bucket_id", "text", False, True),
        ("file_name", "text", False, False), ("file_path", "text", False, False),
        ("alt_text", "text", True, False), ("caption", "text", True, False),
        ("mime_type", "text", True, False), ("file_size", "int8", True, False),
        ("tags", "_text", False, True), ("uploaded_by", "uuid", True, False),
        ("is_public", "bool", False, True), ("created_at", "timestamptz", False, True),
        ("updated_at", "timestamptz", False, True),
    ],
    "bw_profiles": [
        ("id", "uuid", False, True), ("user_id", "uuid", False, False),
        ("username", "text", False, False), ("display_name", "text", True, False),
        ("avatar_url", "text", True, False), ("created_at", "timestamptz", False, True),
        ("updated_at", "timestamptz", False, True),
    ],
    "bw_site_content": [
        ("id", "uuid", False, True), ("page_key", "text", False, False),
        ("section_key", "text", False, False), ("heading", "text", True, False),
        ("subheading", "text", True, False), ("body", "text", True, False),
        ("image_url", "text", True, False), ("cta_label", "text", True, False),
        ("cta_href", "text", True, False), ("metadata", "jsonb", False, True),
        ("published", "bool", False, True), ("sort_order", "int4", False, True),
        ("created_at", "timestamptz", False, True), ("updated_at", "timestamptz", False, True),
    ],
    "bw_stories": [
        ("id", "uuid", False, True), ("slug", "text", False, False),
        ("title", "text", False, False), ("couple_names", "text", False, False),
        ("location", "text", True, False), ("year_label", "text", True, False),
        ("duration_label", "text", True, False), ("excerpt", "text", True, False),
        ("intro", "text", True, False), ("cover_image_url", "text", True, False),
        ("film_url", "text", True, False), ("published", "bool", False, True),
        ("sort_order", "int4", False, True), ("created_at", "timestamptz", False, True),
        ("updated_at", "timestamptz", False, True),
    ],
    "bw_story_gallery_items": [
        ("id", "uuid", False, True), ("story_id", "uuid", False, False),
        ("image_url", "text", False, False), ("alt_text", "text", True, False),
        ("sort_order", "int4", False, True), ("created_at", "timestamptz", False, True),
        ("updated_at", "timestamptz", False, True),
    ],
    "bw_story_sections": [
        ("id", "uuid", False, True), ("story_id", "uuid", False, False),
        ("title", "text", False, False), ("body", "text", False, False),
        ("sort_order", "int4", False, True), ("created_at", "timestamptz", False, True),
        ("updated_at", "timestamptz", False, True),
    ],
    "bw_testimonials": [
        ("id", "uuid", False, True), ("name", "text", False, False),
        ("role", "text", True, False), ("quote", "text", False, False),
        ("image_url", "text", True, False), ("published", "bool", False, True),
        ("sort_order", "int4", False, True), ("created_at", "timestamptz", False, True),
        ("updated_at", "timestamptz", False, True),
    ],
    "bw_user_roles": [
        ("id", "uuid", False, True), ("user_id", "uuid", False, False),
        ("role", "bw_app_role", False, False), ("created_at", "timestamptz", False, True),
    ],
}

RELATIONSHIPS = {
    "bw_story_sections": [("bw_story_sections_story_id_fkey", "story_id", "bw_stories", "id")],
    "bw_story_gallery_items": [("bw_story_gallery_items_story_id_fkey", "story_id", "bw_stories", "id")],
}


def block(kind: str, cols) -> str:
    lines = []
    for name, udt, nullable, has_default in cols:
        ts = TS[udt]
        if kind == "Row":
            optional = ""
            t = f"{ts} | null" if nullable else ts
        elif kind == "Insert":
            optional = "?" if (nullable or has_default) else ""
            t = f"{ts} | null" if nullable else ts
        else:  # Update
            optional = "?"
            t = f"{ts} | null" if nullable else ts
        lines.append(f"          {name}{optional}: {t}")
    return "\n".join(lines)


def rels(table: str) -> str:
    entries = RELATIONSHIPS.get(table, [])
    if not entries:
        return "        Relationships: []"
    out = ["        Relationships: ["]
    for name, col, ref_table, ref_col in entries:
        out += [
            "          {",
            f'            foreignKeyName: "{name}"',
            f'            columns: ["{col}"]',
            "            isOneToOne: false",
            f'            referencedRelation: "{ref_table}"',
            f'            referencedColumns: ["{ref_col}"]',
            "          },",
        ]
    out.append("        ]")
    return "\n".join(out)


tables = []
for table, cols in SCHEMA.items():
    tables.append(
        f"      {table}: {{\n"
        f"        Row: {{\n{block('Row', cols)}\n        }}\n"
        f"        Insert: {{\n{block('Insert', cols)}\n        }}\n"
        f"        Update: {{\n{block('Update', cols)}\n        }}\n"
        f"{rels(table)}\n"
        f"      }}"
    )

HEADER = '''// Generated by scripts/gen-types.py — do not edit by hand.
//
// This Supabase project is shared across several products, so every table this
// site owns is namespaced with a `bw_` prefix. Only those tables are typed here.
// Run `python3 scripts/gen-types.py` after changing the schema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
'''

MIDDLE = '''
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bw_claim_first_admin: { Args: Record<string, never>; Returns: boolean }
      bw_has_role: {
        Args: { _user_id: string; _role: Database["public"]["Enums"]["bw_app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      bw_app_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
'''

root = pathlib.Path(__file__).resolve().parent.parent
helpers = (root / "scripts" / "types-helpers.ts.txt").read_text()

out = HEADER + "\n".join(tables) + MIDDLE + "\n" + helpers
(root / "src" / "integrations" / "supabase" / "types.ts").write_text(out)
print("wrote src/integrations/supabase/types.ts")
