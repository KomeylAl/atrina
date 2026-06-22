export interface Project {
  name: string;
  type: string;
  properties: Properties;
  required: string[];
}

export interface Properties {
  name: Name;
  description: Description;
  technologies: Technologies;
  image_url: ImageUrl;
  client: Client;
  completion_date: CompletionDate;
  category: Category;
  status: Status;
}

export interface Name {
  type: string;
  description: string;
}

export interface Description {
  type: string;
  description: string;
}

export interface Technologies {
  type: string;
  items: Items;
  description: string;
}

export interface Items {
  type: string;
}

export interface ImageUrl {
  type: string;
  description: string;
}

export interface Client {
  type: string;
  description: string;
}

export interface CompletionDate {
  type: string;
  format: string;
  description: string;
}

export interface Category {
  type: string;
  enum: string[];
  description: string;
}

export interface Status {
  type: string;
  enum: string[];
  default: string;
}
