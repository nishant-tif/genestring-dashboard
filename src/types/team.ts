export interface JourneyItem {
  label: string;
  title: string;
  subtitle: string;
  description?: string;
}

export interface ExpertiseItem {
  title: string;
  icon: string;
}

export interface TeamMember {
  id?: number;
  slug: string;
  image: string;
  detailImage: string;
  name: string;
  designation: string;
  organization: string;
  experience: string;
  qualification: string;
  certification: string;
  about: string;
  journey: JourneyItem[];
  expertise: ExpertiseItem[];
}

export interface Testimonial {
  id?: number;
  text: string;
  rating: number;
  reviewerName: string;
  reviewerAge?: number;
  reviewerLocation: string;
  reviewerImage: string;
}

export interface TestimonialsWidgetSettings {
  heading: string;
  description: string;
  testimonials: Testimonial[];
}
