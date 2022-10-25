// type section
export type Section = {
  title: string;
  content: string;
};

// type book
export type Book = {
  id: string;
  title: string;
  audio_length: number;
  category_id: string;
  authors: Array<string>;
  cover_url: string;
  description: string;
  sections: Array<Section>;
};
