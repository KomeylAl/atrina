export interface Work {
  name: string;
  type: string;
  properties: Properties;
  required: string[];
}

export interface Properties {
  title: Title;
  description: Description;
  challenge: Challenge;
  solution: Solution;
  results: Results;
  image_url: ImageUrl;
  gallery_images: GalleryImages;
  technologies: Technologies;
  category: Category;
}

export interface Title {
  type: string;
  description: string;
}

export interface Description {
  type: string;
  description: string;
}

export interface Challenge {
  type: string;
  description: string;
}

export interface Solution {
  type: string;
  description: string;
}

export interface Results {
  type: string;
  description: string;
}

export interface ImageUrl {
  type: string;
  description: string;
}

export interface GalleryImages {
  type: string;
  items: Items;
  description: string;
}

export interface Items {
  type: string;
}

export interface Technologies {
  type: string;
  items: Items2;
  description: string;
}

export interface Items2 {
  type: string;
}

export interface Category {
  type: string;
  enum: string[];
  description: string;
}
