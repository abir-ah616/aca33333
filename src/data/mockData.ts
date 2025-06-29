export interface Author {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar: string;
  joinedDate: string;
  storyCount: number;
  totalReads: number;
  totalComments: number;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  author: Author;
  coverImage: string;
  categories: string[];
  isFeatured: boolean;
  publishedDate: string;
  views: number;
  comments: number;
  parts: StoryPart[];
}

export interface StoryPart {
  id: string;
  partNumber: number;
  title: string;
  content: string;
  publishedDate: string;
  views: number;
}

// Mock Authors Data
export const authors: Author[] = [
  {
    id: '1',
    username: 'snigdha-hossain-mona',
    displayName: 'স্নিগ্ধা হোসেন মোনা',
    bio: 'বাংলা সাহিত্যের অনুরাগী একজন লেখক। ভালোবাসি মানুষের গল্প বলতে।',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-01-15',
    storyCount: 12,
    totalReads: 25000,
    totalComments: 150
  },
  {
    id: '2',
    username: 'mir-ashraf-ria',
    displayName: 'মীর আশরাফ রিয়া',
    bio: 'থ্রিলার এবং রহস্য গল্প লিখতে পছন্দ করি।',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-02-20',
    storyCount: 8,
    totalReads: 18000,
    totalComments: 95
  },
  {
    id: '3',
    username: 'inal-bahunia-rose-queen',
    displayName: 'আইনাল বহুনিয়া (Rose Queen)',
    bio: 'রোমান্টিক গল্পের জগতে বিচরণ করি।',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-03-10',
    storyCount: 15,
    totalReads: 32000,
    totalComments: 200
  },
  {
    id: '4',
    username: 'shamrita',
    displayName: 'শামরিতা',
    bio: 'সামাজিক বিষয় নিয়ে গল্প লিখি। মানুষের জীবনের ছোট ছোট ঘটনা নিয়ে কাজ করি।',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-04-05',
    storyCount: 20,
    totalReads: 45000,
    totalComments: 300
  },
  {
    id: '5',
    username: 'nasrat-sultana-sejuti',
    displayName: 'নাসরাত সুলতানা সেজুতি',
    bio: 'হরর এবং ভৌতিক গল্প লিখতে ভালোবাসি।',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-05-12',
    storyCount: 6,
    totalReads: 12000,
    totalComments: 80
  },
  {
    id: '6',
    username: 'lucky',
    displayName: 'লাকি',
    bio: 'নতুন লেখক। বিভিন্ন ধরনের গল্প নিয়ে পরীক্ষা করছি।',
    avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-06-18',
    storyCount: 4,
    totalReads: 5000,
    totalComments: 35
  },
  {
    id: '7',
    username: 'mushfiqur-rahman-sariraznia-siriaran',
    displayName: 'মুশফিকুর রহমান সারিরাজনিয়া(সিরিয়ান)',
    bio: 'ঐতিহাসিক গল্প এবং পুরাণের আধুনিক রুপায়ণ নিয়ে কাজ করি।',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-07-25',
    storyCount: 10,
    totalReads: 22000,
    totalComments: 120
  },
  {
    id: '8',
    username: 'karnini-tulukdar',
    displayName: 'কর্নিণী তালুকদার',
    bio: 'গ্রামীণ জীবন এবং ঐতিহ্য নিয়ে গল্প লিখি।',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2023-08-14',
    storyCount: 7,
    totalReads: 15000,
    totalComments: 90
  }
];

// Generate story parts for each story
const generateStoryParts = (storyId: string, partCount: number): StoryPart[] => {
  return Array.from({ length: partCount }, (_, index) => ({
    id: `${storyId}-part-${index + 1}`,
    partNumber: index + 1,
    title: `পর্ব ${index + 1}`,
    content: `এটি "${storyId}" গল্পের ${index + 1} নম্বর পর্ব। এখানে গল্পের মূল বিষয়বস্তু থাকবে। লেখক এই পর্বে চরিত্রগুলোর মধ্যে সংলাপ, বর্ণনা, এবং ঘটনাপ্রবাহ তুলে ধরেছেন।

এই গল্পে আমরা দেখতে পাই কীভাবে মানুষের জীবনে ছোট ছোট ঘটনা বড় পরিবর্তন আনতে পারে। প্রতিটি চরিত্র তাদের নিজস্ব স্বপ্ন এবং সংগ্রাম নিয়ে এগিয়ে চলেছে।

গল্পের এই অংশে লেখক পাঠকদের সাথে একটি আবেগময় সংযোগ স্থাপন করেছেন। প্রতিটি বাক্য, প্রতিটি শব্দ পাঠকের মনে গভীর প্রভাব ফেলে।

"জীবনটা অনেক সুন্দর হতে পারত, যদি আমরা একটু বেশি ভালোবাসতে পারতাম।" - এই লাইনটি গল্পের মূল বার্তা প্রকাশ করে।

গল্পের পরবর্তী পর্বে আরও রোমাঞ্চকর ঘটনার অপেক্ষা করছে।`,
    publishedDate: new Date(2023, 8, index + 1).toISOString(),
    views: Math.floor(Math.random() * 1000) + 100
  }));
};

// Mock Stories Data
export const stories: Story[] = [
  {
    id: '1',
    title: 'লাঞ্চের নাকি ভিলেন',
    slug: 'lancer-naki-villain',
    author: authors[0],
    coverImage: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['রোমান্টিক', 'কমেডি'],
    isFeatured: true,
    publishedDate: '2023-09-01',
    views: 10000,
    comments: 0,
    parts: generateStoryParts('1', 36)
  },
  {
    id: '2',
    title: 'ভোগাকে',
    slug: 'bhogake',
    author: authors[1],
    coverImage: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['রোমান্টিক', 'থ্রিলার'],
    isFeatured: true,
    publishedDate: '2023-09-05',
    views: 827,
    comments: 0,
    parts: generateStoryParts('2', 40)
  },
  {
    id: '3',
    title: 'আমি পড়ুজা',
    slug: 'ami-poruza',
    author: authors[2],
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['রোমান্টিক', 'নাটক', 'পারিবারিক'],
    isFeatured: true,
    publishedDate: '2023-09-10',
    views: 7300,
    comments: 0,
    parts: generateStoryParts('3', 91)
  },
  {
    id: '4',
    title: 'পরিজান',
    slug: 'porizan',
    author: authors[6],
    coverImage: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['রোমান্টিক', 'সামাজিক', 'ঐতিহাসিক'],
    isFeatured: false,
    publishedDate: '2023-09-15',
    views: 18600,
    comments: 0,
    parts: generateStoryParts('4', 60)
  },
  {
    id: '5',
    title: 'বাইডিজ কলন্য',
    slug: 'baidiz-colony',
    author: authors[4],
    coverImage: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['রোমান্টিক', 'থ্রিলার', 'নাট্য হরর', 'পারিবারিক', 'সামাজিক'],
    isFeatured: false,
    publishedDate: '2023-09-20',
    views: 28700,
    comments: 0,
    parts: generateStoryParts('5', 67)
  },
  {
    id: '6',
    title: 'প্রেমালিংক',
    slug: 'premalink',
    author: authors[2],
    coverImage: 'https://images.pexels.com/photos/1212693/pexels-photo-1212693.jpeg?auto=compress&cs=tinysrgb&w=400',
    categories: ['রোমান্টিক', 'থ্রিলার'],
    isFeatured: false,
    publishedDate: '2023-09-25',
    views: 733,
    comments: 0,
    parts: generateStoryParts('6', 19)
  }
];

// Featured stories for carousel
export const featuredStories = stories.filter(story => story.isFeatured);

// Get author by username
export const getAuthorByUsername = (username: string): Author | undefined => {
  return authors.find(author => author.username === username);
};

// Get stories by author
export const getStoriesByAuthor = (username: string): Story[] => {
  return stories.filter(story => story.author.username === username);
};

// Get story by slug
export const getStoryBySlug = (slug: string): Story | undefined => {
  return stories.find(story => story.slug === slug);
};

// Get story part
export const getStoryPart = (storySlug: string, partNumber: number): StoryPart | undefined => {
  const story = getStoryBySlug(storySlug);
  if (!story) return undefined;
  return story.parts.find(part => part.partNumber === partNumber);
};

// Categories
export const categories = [
  'রোমান্টিক',
  'থ্রিলার',
  'সামাজিক',
  'হরর',
  'কমেডি',
  'নাটক',
  'পারিবারিক',
  'ঐতিহাসিক',
  'ফ্যান্টাসি',
  'সায়েন্স ফিকশন',
  'রহস্য',
  'ভৌতিক'
];