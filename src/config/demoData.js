// Rich placeholder data for Cinematic Demo Mode

export const DEMO_DATA = {
    valentine: {
        recipientName: "My Dearest Sarah",
        celebrationType: "valentine",
        template: "RoseGarden", // Or "DopamineDream" depending on preference
        opener: "none", // Skip opener for cinematic demo
        musicUrl: "https://www.youtube.com/watch?v=SOJpE1KMUbo", // Dave & Tems - Raindance (User provided)
        senderName: "With all my love, James",
        secretMessage: "You are my favorite adventure. Happy Valentine's Day! ❤️",
        chapters: [
            {
                id: "chap-1",
                title: "The Spark",
                content: "Do you remember that rainy Tuesday at the coffee shop? I looked up from my book, and there you were, laughing at something your friend said. In that moment, the noise of the world faded away, and all I could see was your smile. I knew then that my life was about to change forever.",
                media: [
                    { type: "image", data: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2573&auto=format&fit=crop" }, // Rainy coffee shop/couple vibe
                    { type: "image", data: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2671&auto=format&fit=crop" }  // Couple laughing
                ],
                voiceNote: null
            },
            {
                id: "chap-2",
                title: "Our Adventures",
                content: "From getting lost in Tokyo to our lazy Sunday marathons, every moment with you feels like a scene from a movie I never want to end. You've taught me to see beauty in the smallest things—the way the light hits the leaves, the taste of morning coffee, the sound of rain against the window.",
                media: [
                    { type: "image", data: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=2574&auto=format&fit=crop" }, // Travel/Adventure
                    { type: "image", data: "https://images.unsplash.com/photo-1518175862088-25f03a628670?q=80&w=2670&auto=format&fit=crop" } // Scenic moment
                ],
                voiceNote: true // Simulating a voice note presence
            },
            {
                id: "chap-3",
                title: "Growing Together",
                content: "We've built so much together. Not just a home, but a safe haven where we can both be our true selves. Thank you for your patience, your kindness, and for loving me even when I forget to do the dishes. You are my rock, my muse, and my best friend.",
                media: [
                    { type: "image", data: "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=2672&auto=format&fit=crop" } // Cozy home vibes
                ]
            },
            {
                id: "chap-4",
                title: "Forever Yours",
                content: "As we look to the future, I see endless possibilities. More travels, more laughter, more quiet moments holding hands. I promise to always be by your side, to support your dreams, and to love you more with each passing day. Here's to us, today and always.",
                media: [
                    { type: "image", data: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=2574&auto=format&fit=crop" }, // Holding hands/Sunset
                    { type: "image", data: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2671&auto=format&fit=crop" } // Romantic atmosphere
                ]
            }
        ]
    }
};
