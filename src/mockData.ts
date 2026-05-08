export type CampusNode = {
  id: string;
  label: string;
  type: string;
  lat: number;
  lng: number;
  image: string;
  aliases: string[];
  descriptionVi: string;
  descriptionEn: string;
  openingHour: string;
  closingHour: string;
  rating: number;
  feedbacks: FeedbackItem[];
};

export type Edge = {
  from: string;
  to: string;
  distance: number;
  note: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export type FeedbackItem = {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
  avatar?: string;
};

export type CommunityFeedback = FeedbackItem & {
  id: string;
};

import generatedData from './mockData.generated (1).json';

export const mockNodes: CampusNode[] = generatedData.mockNodes as CampusNode[];
export const mockEdges: Edge[] = generatedData.mockEdges as Edge[];
export const mockMembers: TeamMember[] = generatedData.mockMembers as TeamMember[];
export const mockCommunityFeedbacks: CommunityFeedback[] = generatedData.mockCommunityFeedbacks as CommunityFeedback[];
