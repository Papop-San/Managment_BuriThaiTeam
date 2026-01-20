export type UploadedFile = {
    id?: number;               
    file: File | null;        
    preview: string;           
    type: "cover" | "slide";
    is_cover: boolean;
  };