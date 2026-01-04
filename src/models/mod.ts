export enum ModrinthProjectType {
  MOD = 'mod',
  MODPACK = 'modpack',
  RESOURCEPACK = 'resourcepack',
  SHADER = 'shader',
  WORLD = 'world',
}

export enum ModSideSupport {
  REQUIRED = 'required',
  OPTIONAL = 'optional',
  UNSUPPORTED = 'unsupported',
  UNKNOWN = 'unknown',
}

export enum ModVersionType {
  RELEASE = 'release',
  BETA = 'beta',
  ALPHA = 'alpha',
}

export enum ModUpdateStatus {
  ALREADY_UP_TO_DATE = "already_up_to_date",
  UPDATE_AVAILABLE = "update_available",
  NO_COMPATIBLE_VERSIONS = "no_compatible_versions",
  ERROR = "error",
}

export interface Mod {
  id: string;
  slug: string;
  version_id: string;
  project_id: string;
  title: string;
  icon_url: string;
  version_name: string;
  version_number: number;

  miniverse_id: number;
}

export interface ModrinthSearchResult {
  project_id: string;
  project_type: ModrinthProjectType;
  slug: string;
  author: string;
  title: string;
  description: string;
  categories: string[];
  display_categories: string[];
  versions: string[];
  downloads: number
  follows: number
  icon_url: string;
  date_created: number
  date_modified: number
  latest_version: string;
  license: string;
  client_side: ModSideSupport
  server_side: ModSideSupport
  gallery: any[];
  color?: number;
  featured_gallery?: any[];
}

export interface ModrinthSearchResults {
  hits: ModrinthSearchResult[]
  offset: number;
  limit: number;
  total_hits: number;
}

export interface ModrinthFileHashes {
  sha1: string;
  sha256: string;
}

export interface ModrinthProjectFile {
  hashes: ModrinthFileHashes;
  url: string;
  filename: string;
  primary: boolean;
  size: number;
  file_type?: 'required-resource-pack' | 'optional-resource-pack' | null;
}

export interface ModrinthGalleryItem {
  url: string;
  raw_url: string;
  featured: boolean;
  title: string;
  description: string;
  created: number;
}

export interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  categories: string[];
  client_side: ModSideSupport;
  server_side: ModSideSupport;
  issues_url: string;
  source_url: string;
  wiki_url: string;
  discord_url: string;
  color?: number;
  team: string;
  published: number;
  updated: number;
  followers: number;
  project_type: ModrinthProjectType;
  downloads: number;
  icon_url: string;
  versions: string[];
  game_versions: string[];
  loaders: string[];
  gallery: ModrinthGalleryItem[];
}

export interface ModrinthProjectVersion {
  id: string;
  project_id: string;
  author_id: string;
  date_published: number;
  downloads: number;
  name: string;
  version_number: string;
  changelog: string;
  game_versions: string[];
  version_type: ModVersionType;
  loaders: string[];
  featured: boolean;
  status: string;
  requested_status: string;
  files: ModrinthProjectFile[];
  dependencies?: string[];
}