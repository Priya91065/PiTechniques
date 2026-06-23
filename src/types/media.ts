/** Media item as serialized by the admin API (dates are ISO strings). */
export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: string;
}

export interface MediaPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
