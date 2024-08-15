export class GritCenterOtherDocumentDto {
  id: number;
  category_id: number;
  title: string;
  link: string | null;
  description: string;
  image: string;
  content: string;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  key_words: string;
  file_audio: string | null;
  file_pdf: string;
  slug: string;
  fee_type: number;
}

export class GritCenterDocumentDto {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  type: string;
  file_audio: string;
  file_pdf: string;
  link: string | null;
  type_name: string;
  is_bookmark: boolean;
  orther_documents: GritCenterOtherDocumentDto[];
}
