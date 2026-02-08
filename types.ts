
export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  STUDY = 'STUDY',
  QUIZ = 'QUIZ',
  INFO = 'INFO',
  LIVE = 'LIVE',
  COLLABORATION = 'COLLABORATION',
  GROUP_HUB = 'GROUP_HUB'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: number;
}

export interface StudyModule {
  id: string;
  title: string;
  timestamp: number;
  notes: string;
  keyConcepts: string[];
  quizzes: QuizQuestion[];
  sourceType: 'image' | 'audio' | 'text';
  progress: number;
  authorId: string;
  authorName?: string;
  groupId?: string;
  isShared?: boolean;
  comments?: Comment[];
}

export interface GroupActivity {
  id: string;
  type: 'note_added' | 'quiz_started' | 'member_joined';
  userName: string;
  contentTitle?: string;
  timestamp: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  creatorId: string;
  members: User[];
  isPublic: boolean;
  activities?: GroupActivity[];
}

export interface QuizChallenge {
  id: string;
  moduleId: string;
  moduleTitle: string;
  creatorId: string;
  groupId?: string;
  participants: {
    userId: string;
    userName: string;
    score: number;
    status: 'pending' | 'completed';
  }[];
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}
