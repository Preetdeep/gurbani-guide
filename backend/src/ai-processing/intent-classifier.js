// Intent Classification System for Gurbani Guide AI
const IntentClassifier = {
  // Primary intent categories with trigger patterns
  intentCategories: {
    work_professional: {
      triggerWords: ['work', 'job', 'career', 'office', 'boss', 'colleague', 'deadline', 'promotion', 'stress', 'pressure'],
      patterns: [
        /stressed.*work/i,
        /workplace.*pressure/i,
        /boss.*problem/i,
        /career.*decision/i,
        /work.*ethics/i,
        /office.*politics/i
      ],
      subIntents: {
        workplace_stress: ['overwhelmed', 'pressure', 'deadline', 'anxiety'],
        career_guidance: ['promotion', 'job change', 'career path', 'decision'],
        workplace_ethics: ['honesty', 'integrity', 'corruption', 'moral dilemma'],
        colleague_conflicts: ['team', 'conflict', 'disagreement', 'difficult people']
      }
    },
    
    family_relationships: {
      triggerWords: ['family', 'parents', 'mother', 'father', 'children', 'marriage', 'spouse', 'home', 'respect'],
      patterns: [
        /family.*pressure/i,
        /parent.*problem/i,
        /marriage.*issue/i,
        /children.*guidance/i,
        /family.*conflict/i
      ],
      subIntents: {
        parent_relationships: ['parents want', 'family expects', 'traditional vs modern'],
        marriage_guidance: ['spouse', 'marriage problems', 'relationship'],
        child_guidance: ['children', 'parenting', 'raising kids'],
        family_harmony: ['family conflict', 'generations', 'tradition']
      }
    },
    
    mental_wellness: {
      triggerWords: ['anxiety', 'depression', 'stress', 'worry', 'mental health', 'peace', 'calm', 'overwhelmed'],
      patterns: [
        /feeling.*anxious/i,
        /mental.*health/i,
        /stressed.*out/i,
        /can't.*sleep/i,
        /worried.*about/i
      ],
      subIntents: {
        anxiety_management: ['anxiety', 'panic', 'nervous', 'worried'],
        depression_support: ['depression', 'sad', 'hopeless', 'down'],
        stress_relief: ['stress', 'overwhelmed', 'pressure', 'tension'],
        sleep_issues: ['sleep', 'insomnia', 'rest', 'tired']
      }
    },
    
    technology_balance: {
      triggerWords: ['phone', 'social media', 'internet', 'digital', 'screen', 'addiction', 'online'],
      patterns: [
        /phone.*addiction/i,
        /social.*media.*problem/i,
        /too.*much.*screen/i,
        /digital.*overwhelm/i,
        /internet.*distraction/i
      ],
      subIntents: {
        social_media_issues: ['social media', 'instagram', 'facebook', 'comparison'],
        digital_addiction: ['phone addiction', 'screen time', 'digital detox'],
        online_relationships: ['virtual friends', 'online dating', 'digital connection']
      }
    },
    
    spiritual_practice: {
      triggerWords: ['prayer', 'meditation', 'simran', 'path', 'gurdwara', 'spiritual', 'faith', 'belief'],
      patterns: [
        /spiritual.*routine/i,
        /how.*to.*meditate/i,
        /daily.*prayer/i,
        /losing.*faith/i,
        /spiritual.*growth/i
      ],
      subIntents: {
        daily_practice: ['daily routine', 'morning prayer', 'evening prayer'],
        meditation_guidance: ['meditation', 'simran', 'concentration', 'focus'],
        faith_questions: ['doubt', 'faith', 'belief', 'questioning'],
        community_connection: ['gurdwara', 'sangat', 'community', 'fellowship']
      }
    }
  },

  // Classify user input and return intent with confidence
  classifyIntent(userInput) {
    const text = userInput.toLowerCase();
    const results = [];
    
    // Check each category
    for (const [category, config] of Object.entries(this.intentCategories)) {
      let score = 0;
      
      // Check trigger words
      const wordMatches = config.triggerWords.filter(word => text.includes(word));
      score += wordMatches.length * 2;
      
      // Check patterns
      const patternMatches = config.patterns.filter(pattern => pattern.test(text));
      score += patternMatches.length * 3;
      
      // Check sub-intents
      let subIntent = null;
      let maxSubScore = 0;
      
      for (const [sub, keywords] of Object.entries(config.subIntents)) {
        const subMatches = keywords.filter(keyword => text.includes(keyword));
        if (subMatches.length > maxSubScore) {
          maxSubScore = subMatches.length;
          subIntent = sub;
        }
      }
      
      if (score > 0) {
        results.push({
          category,
          subIntent,
          confidence: Math.min(score / 10, 1.0),
          matches: { words: wordMatches, patterns: patternMatches.length }
        });
      }
    }
    
    // Sort by confidence and return top result
    results.sort((a, b) => b.confidence - a.confidence);
    
    return results.length > 0 ? results[0] : {
      category: 'general_guidance',
      subIntent: null,
      confidence: 0.5,
      matches: { words: [], patterns: 0 }
    };
  }
};

module.exports = IntentClassifier;
