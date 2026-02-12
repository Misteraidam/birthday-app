// Celebration Portal Configuration
// Defines celebration types, templates, and their theme configurations

export const CELEBRATION_TYPES = [
    {
        id: 'valentine',
        icon: '💖',
        name: "Valentine's Day",
        description: 'Create a story of love and romance for your special someone.',
        color: '#FF6B9D',
        gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C93B76 100%)',
        primaryTheme: 'RoseGarden',
        defaultChapters: [
            { title: 'The Spark', hint: 'Describe the moment you first met or that first "feeling"...' },
            { title: 'The Best Days', hint: 'Write about a favorite day or adventure you shared together...' },
            { title: 'Why I Love You', hint: "Share the little things about them that make your heart melt..." },
            { title: 'To Our Future', hint: 'What adventures or dreams do you look forward to chasing together?' }
        ],
        recommendedTemplates: ['RoseGarden', 'soft-gradient', 'DopamineDream']
    },
    {
        id: 'birthday',
        icon: '🎂',
        name: 'Birthday',
        description: 'Celebrate another year with a custom story and wishes.',
        color: '#FFD700',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        primaryTheme: 'CelebrationPop',
        defaultChapters: [
            { title: 'Happy Birthday!', hint: "Write a heartfelt birthday wish for this amazing person..." },
            { title: 'Unforgettable Memories', hint: 'Recall a fun story or achievement from the past year...' },
            { title: 'Why You are Special', hint: 'What makes them unique? Tell them how much they mean to you...' },
            { title: 'Leveled Up!', hint: 'Share your hopes and excitement for their incredible year ahead!' }
        ],
        recommendedTemplates: ['CelebrationPop', 'GoldenJubilee', 'neon-glow']
    },
    {
        id: 'anniversary',
        icon: '💍',
        name: 'Anniversary',
        description: 'Mark your milestone with a heartfelt story of your journey.',
        color: '#E8C4A0',
        gradient: 'linear-gradient(135deg, #E8C4A0 0%, #D4A574 100%)',
        primaryTheme: 'EternalVow',
        defaultChapters: [
            { title: 'The Journey So Far', hint: 'Reflect on the milestones and growth you have shared...' },
            { title: 'Cherished Moments', hint: 'Walk through some of the beautiful memories you have built...' },
            { title: 'Strength & Love', hint: 'Talk about the bond that keeps you both together through it all...' },
            { title: 'Forever Ahead', hint: 'A message for the many more wonderful years to come!' }
        ],
        recommendedTemplates: ['EternalVow', 'VintageFilm', 'luxury-gold']
    },
    {
        id: 'graduation',
        icon: '🎓',
        name: 'Graduation',
        description: 'Commemorate academic success and future endeavors.',
        color: '#4A90D9',
        gradient: 'linear-gradient(135deg, #4A90D9 0%, #1E3A5F 100%)',
        primaryTheme: 'CapAndGown',
        defaultChapters: [
            { title: 'The Hard Work Paid Off', hint: "Celebrate their dedication and the effort it took to get here..." },
            { title: 'Golden Campus Days', hint: 'Recall the best parts of the student journey and friendships...' },
            { title: 'Pure Pride', hint: 'Express how proud you and everyone else are of this achievement!' },
            { title: 'The Bright Horizon', hint: "Send off with inspiration for their next big life chapter..." }
        ],
        recommendedTemplates: ['CapAndGown', 'CosmicDream', 'NeoBrutalistFlow']
    },
    {
        id: 'memorial',
        icon: '🕊️',
        name: 'Memorial',
        description: 'Honor the memory of a loved one with a touching tribute.',
        color: '#8B9DC3',
        gradient: 'linear-gradient(135deg, #8B9DC3 0%, #5D6D7E 100%)',
        primaryTheme: 'SoftMemorial',
        defaultChapters: [
            { title: 'A Life Well Lived', hint: 'Honor the incredible person they were and their beautiful legacy...' },
            { title: 'Cherished Memories', hint: 'Share the special moments that will stay in your heart forever...' },
            { title: 'A Guiding Light', hint: 'Talk about the wisdom and love they shared with everyone...' },
            { title: 'Forever Remembered', hint: "A final message of peace and eternal remembrance..." }
        ],
        recommendedTemplates: ['SoftMemorial', 'MuseumCore', 'cosmic-reveal']
    },
    {
        id: 'custom',
        icon: '✨',
        name: 'General / Custom',
        description: 'Design a story for any unique celebration or event.',
        color: '#9B59B6',
        gradient: 'linear-gradient(135deg, #9B59B6 0%, #6C3483 100%)',
        primaryTheme: null,
        defaultChapters: [
            { title: 'The Beginning', hint: 'How this story or adventure first started...' },
            { title: 'Key Highlights', hint: 'Describe the most important moments of this celebration...' },
            { title: 'Message of Purpose', hint: 'Why this moment matters to you and the recipient...' },
            { title: 'Looking Ahead', hint: 'Final thoughts on what comes next after this celebration!' }
        ],
        recommendedTemplates: ['KineticBento', 'MinimalStory', 'NeonNights']
    }
];

export const TEMPLATES = [
    {
        id: 'RoseGarden',
        name: 'Enchanted Rose',
        description: 'Romantic reds with soaring birds and floral swirls',
        preview: 'bg-gradient-to-br from-rose-500 to-pink-600',
        primaryColor: '#E11D48',
        secondaryColor: '#FDF2F8',
        accentColor: '#BE185D',
        fontFamily: "'Cormorant Garamond', serif",
        celebrationTypes: ['valentine', 'custom'],
        defaultOpener: 'none',
        particles: 'petals'
    },
    {
        id: 'GoldenJubilee',
        name: 'Grand Celebration',
        description: 'Regal gold and black with rising sparks of light',
        preview: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        primaryColor: '#FFD700',
        secondaryColor: '#0A0A0A',
        accentColor: '#F59E0B',
        fontFamily: "'Playfair Display', serif",
        celebrationTypes: ['birthday', 'custom'],
        defaultOpener: 'none',
        particles: 'sparks-up'
    },
    {
        id: 'EternalVow',
        name: 'Golden Anniversary',
        description: 'Elegant cream and rose gold with soft falling petals',
        preview: 'bg-gradient-to-br from-amber-100 to-rose-200',
        primaryColor: '#D4A574',
        secondaryColor: '#FFFBEB',
        accentColor: '#B45309',
        fontFamily: "'Cormorant Garamond', serif",
        celebrationTypes: ['anniversary', 'valentine', 'custom'],
        defaultOpener: 'none',
        particles: 'petals'
    },
    {
        id: 'CapAndGown',
        name: 'The Graduate',
        description: 'Navy and gold with a flurry of celebrating confetti',
        preview: 'bg-gradient-to-br from-blue-900 to-indigo-900',
        primaryColor: '#1E3A5F',
        secondaryColor: '#FFD700',
        accentColor: '#3B82F6',
        fontFamily: "'Montserrat', sans-serif",
        celebrationTypes: ['graduation', 'custom'],
        defaultOpener: 'none',
        particles: 'confetti'
    },
    {
        id: 'SoftMemorial',
        name: 'Dove Peace',
        description: 'Muted tones with floating white feathers and soft rain',
        preview: 'bg-gradient-to-br from-slate-300 to-blue-200',
        primaryColor: '#64748B',
        secondaryColor: '#F8FAFC',
        accentColor: '#8B9DC3',
        fontFamily: "'Lora', serif",
        celebrationTypes: ['memorial', 'custom'],
        defaultOpener: 'none',
        particles: 'feathers'
    },
    {
        id: 'CelebrationPop',
        name: 'Party Pop',
        description: 'Vibrant gradients with high-energy balloon effects',
        preview: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
        primaryColor: '#A855F7',
        secondaryColor: '#0A0A0A',
        accentColor: '#EC4899',
        fontFamily: "'Poppins', sans-serif",
        celebrationTypes: ['birthday', 'custom'],
        defaultOpener: 'none',
        particles: 'confetti'
    },
    {
        id: 'MinimalStory',
        name: 'Editorial Minimal',
        description: 'Clean magazine-style layout for a timeless narrative',
        preview: 'bg-white border-2 border-black',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        accentColor: '#6B7280',
        fontFamily: "'Inter', sans-serif",
        celebrationTypes: ['anniversary', 'graduation', 'memorial', 'custom'],
        defaultOpener: 'none',
        particles: 'fireflies'
    },
    {
        id: 'CosmicDream',
        name: 'Infinite Odyssey',
        description: 'Deep space parallax with twinkling galaxies',
        preview: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
        primaryColor: '#7C3AED',
        secondaryColor: '#0F0A1A',
        accentColor: '#C4B5FD',
        fontFamily: "'Space Grotesk', sans-serif",
        celebrationTypes: ['valentine', 'graduation', 'custom'],
        defaultOpener: 'none',
        particles: 'galaxy'
    },
    {
        id: 'VintageFilm',
        name: 'Memory Reel',
        description: 'Sepia film reel aesthetic with nostalgic grain',
        preview: 'bg-gradient-to-br from-amber-200 to-yellow-100',
        primaryColor: '#78350F',
        secondaryColor: '#FEF3C7',
        accentColor: '#92400E',
        fontFamily: "'EB Garamond', serif",
        celebrationTypes: ['anniversary', 'memorial', 'custom'],
        defaultOpener: 'none',
        particles: 'none'
    },
    {
        id: 'NeonNights',
        name: 'Future Pulse',
        description: 'Cyberpunk energy with neon scan-lines and glitch nodes',
        preview: 'bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500',
        primaryColor: '#06B6D4',
        secondaryColor: '#0A0A0A',
        accentColor: '#F0ABFC',
        fontFamily: "'Orbitron', sans-serif",
        celebrationTypes: ['birthday', 'graduation', 'custom'],
        defaultOpener: 'none',
        particles: 'galaxy'
    },
    {
        id: 'KineticBento',
        name: 'Modern Modular',
        description: 'Clean grid-based layout with deep glassmorphism',
        preview: 'bg-[#050505] border-2 border-cyan-500/30',
        primaryColor: '#06B6D4',
        secondaryColor: '#050505',
        accentColor: '#22D3EE',
        fontFamily: "'Inter', sans-serif",
        celebrationTypes: ['birthday', 'graduation', 'custom'],
        defaultOpener: 'none',
        particles: 'galaxy'
    },
    {
        id: 'MuseumCore',
        name: 'Legacy Gallery',
        description: 'Opulent exhibition design with timeless serif type',
        preview: 'bg-[#FAF9F6] border-2 border-[#D4AF37]/30',
        primaryColor: '#D4AF37',
        secondaryColor: '#FAF9F6',
        accentColor: '#1A1A1A',
        fontFamily: "'Playfair Display', serif",
        celebrationTypes: ['anniversary', 'memorial', 'valentine', 'custom'],
        defaultOpener: 'none',
        particles: 'none'
    },
    {
        id: 'DopamineDream',
        name: 'Vibrant Love',
        description: 'Liquid animations and high-energy pastel bursts',
        preview: 'bg-gradient-to-r from-[#FF69B4] to-[#00FFFF]',
        primaryColor: '#FF69B4',
        secondaryColor: '#FFF0F5',
        accentColor: '#00FFFF',
        fontFamily: "'Poppins', sans-serif",
        celebrationTypes: ['valentine', 'birthday', 'custom'],
        defaultOpener: 'none',
        particles: 'confetti'
    },
    {
        id: 'NeoBrutalistFlow',
        name: 'Raw Statement',
        description: 'Bold high-contrast grids and aggressive typography',
        preview: 'bg-[#FFFF00] border-4 border-black',
        primaryColor: '#FFFF00',
        secondaryColor: '#FFFFFF',
        accentColor: '#000000',
        fontFamily: "'Inter', sans-serif",
        celebrationTypes: ['birthday', 'graduation', 'custom'],
        defaultOpener: 'none',
        particles: 'sunbeams'
    },
    {
        id: 'editorial',
        name: 'Classic Editorial',
        description: 'Paper-textured magazine layout with bold headings',
        preview: 'bg-[#FDFBEE] border border-black/10',
        primaryColor: '#110000',
        secondaryColor: '#FDFBEE',
        accentColor: '#C4A052',
        fontFamily: "'Cormorant Garamond', serif",
        celebrationTypes: ['anniversary', 'memorial', 'custom'],
        defaultOpener: 'none',
        particles: 'none'
    },
    {
        id: 'midnight-luxe',
        name: 'Noir Spotlight',
        description: 'Deep black with cinematic gold focal points',
        preview: 'bg-[#050505] border border-[#FDB931]/30',
        primaryColor: '#FDB931',
        secondaryColor: '#050505',
        accentColor: '#FFD700',
        fontFamily: "'Playfair Display', serif",
        celebrationTypes: ['birthday', 'anniversary', 'custom'],
        defaultOpener: 'none',
        particles: 'sparks-up'
    },
    {
        id: 'soft-gradient',
        name: 'Kindred Spirit',
        description: 'Soft pastel gradients with gentle falling petals',
        preview: 'bg-gradient-to-br from-[#FDA4AF] to-[#67E8F9]',
        primaryColor: '#F472B6',
        secondaryColor: '#FDF4F5',
        accentColor: '#60A5FA',
        fontFamily: "'Inter', sans-serif",
        celebrationTypes: ['valentine', 'birthday', 'custom'],
        defaultOpener: 'none',
        particles: 'petals'
    },
    {
        id: 'neon-glow',
        name: 'Neon Neural',
        description: 'Cybernetic neon fields with pulsing neural grids',
        preview: 'bg-black border border-[#00FFFF]',
        primaryColor: '#00FFFF',
        secondaryColor: '#020202',
        accentColor: '#FF00FF',
        fontFamily: "'Orbitron', sans-serif",
        celebrationTypes: ['birthday', 'graduation', 'custom'],
        defaultOpener: 'none',
        particles: 'galaxy'
    },
    {
        id: 'cosmic-reveal',
        name: 'Ethereal Space',
        description: 'Clean cosmic layout with starlight navigation',
        preview: 'bg-[#f9fafb] border border-gray-200',
        primaryColor: '#111827',
        secondaryColor: '#f9fafb',
        accentColor: '#4F46E5',
        fontFamily: "'Inter', sans-serif",
        celebrationTypes: ['graduation', 'birthday', 'custom'],
        defaultOpener: 'none',
        particles: 'galaxy'
    },
    {
        id: 'luxury-gold',
        name: 'Elite Archive',
        description: 'Premium gold tones for prestigious milestones',
        preview: 'bg-black border border-[#D4AF37]',
        primaryColor: '#D4AF37',
        secondaryColor: '#000000',
        accentColor: '#FFFACD',
        fontFamily: "'Playfair Display', serif",
        celebrationTypes: ['anniversary', 'birthday', 'custom'],
        defaultOpener: 'none',
        particles: 'none'
    }
];

// --- MUSIC LIBRARY (Royalty-Free High Quality) ---
export const MUSIC_LIBRARY = {
    romantic: [
        { id: 'rom-1', name: 'First Light (Piano)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', author: 'Celebration Studios' },
        { id: 'rom-2', name: 'Love Theme', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', author: 'Celebration Studios' }
    ],
    joyful: [
        { id: 'pop-1', name: 'Sunshine Day', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', author: 'Celebration Studios' },
        { id: 'pop-2', name: 'Good Vibes Only', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', author: 'Celebration Studios' }
    ],
    triumphant: [
        { id: 'edu-1', name: 'Victory Lap', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', author: 'Celebration Studios' },
        { id: 'edu-2', name: 'Summit', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', author: 'Celebration Studios' }
    ],
    peaceful: [
        { id: 'zen-1', name: 'Morning Mist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', author: 'Celebration Studios' },
        { id: 'zen-2', name: 'Reflections', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', author: 'Celebration Studios' }
    ],
    uplifting: [
        { id: 'up-1', name: 'New Horizons', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', author: 'Celebration Studios' },
        { id: 'up-2', name: 'Rising Star', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', author: 'Celebration Studios' }
    ]
};

// Helper: Get music by mood
export const getMusicInLibrary = (mood) => MUSIC_LIBRARY[mood] || MUSIC_LIBRARY.joyful;

// Get celebration type by ID
export const getCelebrationType = (id) => {
    return CELEBRATION_TYPES.find(c => c.id === id) || CELEBRATION_TYPES[5]; // Default to custom
};

// Get template by ID
export const getTemplate = (id) => {
    return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
};

// Get templates for a celebration type
export const getTemplatesForCelebration = (celebrationId) => {
    return TEMPLATES.filter(t => t.celebrationTypes.includes(celebrationId));
};
// --- STORY TEMPLATES (Pre-filled Narratives) ---
export const STORY_TEMPLATES = {
    birthday: [
        {
            id: 'classic',
            label: 'Classic & Fun',
            icon: '🎉',
            description: 'Standard birthday wishes and good vibes.',
            chapters: [
                { title: 'Happy Birthday!', content: "Wishing you the happiest of birthdays! May this year bring you laughter, joy, and everything you've been hoping for.", media: [] },
                { title: 'Another Year Wiser', content: "They say age is just a number, but you make it look good! Here's to leveling up and taking on new adventures.", media: [] },
                { title: 'Make a Wish', content: "Blow out the candles and dream big. You deserve it all today!", media: [] }
            ]
        },
        {
            id: 'roast',
            label: 'Funny / Roast',
            icon: '🤪',
            description: 'Jokes about age and wild memories.',
            chapters: [
                { title: 'Old & Gold', content: "I was going to make an age joke, but I felt bad for your back... Happy Birthday anyway!", media: [] },
                { title: 'Remember When?', content: "We've had some wild times together. Luckily, most of the evidence is deleted... except this photo.", media: [] },
                { title: 'Stay Young', content: "Growing old is mandatory, growing up is optional. Keep being a kid at heart!", media: [] }
            ]
        },
        {
            id: 'emotional',
            label: 'Sentimental',
            icon: '❤️',
            description: 'Deep, heartfelt connection.',
            chapters: [
                { title: 'To My Favorite Person', content: "Words can't describe how much you mean to me. You light up every room you enter and make life so much brighter.", media: [] },
                { title: 'Beautiful Memories', content: "Looking back at all we've shared, I'm so grateful for every moment. You are truly one of a kind.", media: [] },
                { title: 'My Wish For You', content: "I hope you know how deeply loved you are today and every day. Happy Birthday.", media: [] }
            ]
        }
    ],
    valentine: [
        {
            id: 'romantic',
            label: 'Deeply Romantic',
            icon: '🌹',
            description: 'For your one and only.',
            chapters: [
                { title: 'My One & Only', content: "From the moment we met, I knew you were special. You have stolen my heart completely.", media: [] },
                { title: 'Our Journey', content: "Every day with you is an adventure I never want to end. Thank you for being my partner in crime.", media: [] },
                { title: 'Forever Yours', content: "I love you more than words can say. Happy Valentine's Day, my love.", media: [] }
            ]
        },
        {
            id: 'cute',
            label: 'Cute & Sweet',
            icon: '🥰',
            description: 'Lighthearted love and affection.',
            chapters: [
                { title: 'Hey You!', content: "Just wanted to remind you that you're my favorite human. (Don't tell the others!)", media: [] },
                { title: 'You Make Me Smile', content: "Life is just better when you're around. Thanks for all the laughs and squeezy hugs.", media: [] },
                { title: 'XOXO', content: "Sending you all my love today! Can't wait for our next date night.", media: [] }
            ]
        }
    ],
    anniversary: [
        {
            id: 'milestone',
            label: 'Milestone',
            icon: '💍',
            description: 'Celebrating the years together.',
            chapters: [
                { title: 'Happy Anniversary', content: "Can you believe how far we've come? Here's to us and the beautiful life we've built.", media: [] },
                { title: 'Through The Years', content: "We've had ups and downs, but we always come out stronger. You are my rock.", media: [] },
                { title: 'To Many More', content: "I choose you today, tomorrow, and forever. I love you.", media: [] }
            ]
        }
    ],
    // Default fallback for others
    default: [
        {
            id: 'appreciation',
            label: 'Appreciation',
            icon: '✨',
            description: 'Show them how much they matter.',
            chapters: [
                { title: 'Celebrating You', content: "Today is all about you! I wanted to take a moment to appreciate everything you do.", media: [] },
                { title: 'Moments of Joy', content: "You bring so much positivity to everyone around you. Never change!", media: [] },
                { title: 'Best Wishes', content: "Sending you good vibes and happiness for the chapter ahead.", media: [] }
            ]
        }
    ]
};
