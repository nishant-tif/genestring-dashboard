export type WidgetType =
  | "BANNER"
  | "NUMBER"
  | "ABOUT"
  | "PROGRAMME"
  | "FOOTER"
  | "SPEAKER"
  | "BOOKLET_TOOLKIT"
  | "AI_TOOLSET"
  | "PODCAST"
  | "SUCCESS_CASE"
  | "ANGEL_SLIDER"
  | "NEWS"
  | "BLOG";

export interface ProgrammeCard {
  title: string;
  description?: string;
  image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SpeakerDetails {
  name: string;
  designation?: string;
  company?: string;
  image?: string;
}

export interface Widget {
  widget_id?: number;
  widget_type: WidgetType;
  widget_heading?: string;
  widget_description?: string;
  widget_subheading?: string;

  widget_number_count?: number;
  widget_number_prefix?: string;
  widget_number_suffix?: string;
  widget_number_color?: string;
  widget_number_index?: number;

  widget_button_text?: string;
  widget_button_link?: string;

  widget_programme_cards?: ProgrammeCard[];
  widget_faqs?: FAQ[];

  widget_speaker_details?: SpeakerDetails[];

  widget_booklet_file?: string;

  widget_ai_toolset_price?: number;
}

export interface Regulation {
  title: string;
  image: string;
}
