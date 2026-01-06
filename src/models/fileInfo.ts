export interface FileInfo {
  is_folder: boolean;
  path: string;
  name: string;
  created: number;
  updated: number;
  size?: number;
}