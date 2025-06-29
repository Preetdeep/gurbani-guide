// Response Generation System for Gurbani Guide AI
const ResponseGenerator = {
  
  // Response template structure
  responseTemplate: {
    greeting: "🙏 Waheguru ji ka Khalsa, Waheguru ji ki Fateh!",
    components: [
      'empathy_acknowledgment',
      'gurbani_foundation', 
      'kathakar_wisdom',
      'historical_context',
      'practical_steps',
      'follow_up_questions',
      'closing_blessing'
    ]
  },

  // Generate complete spiritual guidance response
  async generateResponse(intent, userQuery, gurbaniContent, kathakarTeaching) {
    const response = {
      greeting: this.responseTemplate.greeting,
      empathy: this.generateEmpathy(intent, userQuery),
      gurbani: this.formatGurbaniGuidance(gurbaniContent),
      kathakar: this.formatKathakarWisdom(kathakarTeaching),
      practical: this.generatePracticalSteps(intent),
      followUp: this.generateFollowUp(intent),
      closing: this.generateClosing()
    };

    return this.formatFinalResponse(response);
  },

  // Generate empathetic acknowledgment
  generateEmpathy(intent, userQuery) {
    const empathyTemplates = {
      work_professional: [
        "I understand how challenging workplace pressure can feel. Many urban Sikhs face similar struggles in their professional lives.",
        "Work stress is very real, and it's important to address it both practically and spiritually.",
        "Professional challenges test our values and resilience. You're not alone in this journey."
      ],
      family_relationships: [
        "Family relationships can be complex, especially when balancing tradition with personal growth.",
        "Your desire to honor family while staying true to yourself shows wisdom and maturity.",
        "These family dynamics are challenging for many Sikhs navigating modern life."
      ],
      mental_wellness: [
        "Mental health is just as important as physical health, and seeking guidance shows strength.",
        "Many people struggle with these feelings. There's wisdom in both spiritual practice and professional support.",
        "Your wellbeing matters, and there are both spiritual and practical approaches to healing."
      ],
      technology_balance: [
        "Digital overwhelm is a modern challenge that affects many of us. You're wise to seek balance.",
        "Technology can be a tool for growth or distraction - finding the right balance is key.",
        "Many young Sikhs struggle with this. There are spiritual approaches to digital wellness."
      ]
    };

    const templates = empathyTemplates[intent.category] || empathyTemplates.family_relationships;
    return templates[Math.floor(Math.random() * templates.length)];
  },

  // Format Gurbani guidance section
  formatGurbaniGuidance(gurbaniContent) {
    return {
      verse: gurbaniContent.gurmukhi,
      translation: gurbaniContent.translation,
      reference: `Guru Granth Sahib, Ang ${gurbaniContent.ang}`,
      context: gurbaniContent.contextual_meaning || gurbaniContent.commentary.sahib_singh_darpan
    };
  },

  // Format kathakar wisdom section  
  formatKathakarWisdom(kathakarTeaching) {
    return {
      source: `From ${kathakarTeaching.kathakar}:`,
      teaching: kathakarTeaching.practical_advice,
      application: kathakarTeaching.target_situation
    };
  },

  // Generate practical action steps
  generatePracticalSteps(intent) {
    const practicalSteps = {
      work_professional: [
        "Start each workday with 5 minutes of 'Waheguru' jaap to center yourself",
        "During high-pressure moments, take three deep breaths while silently reciting naam",
        "Set professional boundaries respectfully: 'I will complete this with quality by [realistic deadline]'",
        "End workday by reflecting: 'How did I serve through my work today?'",
        "Seek mentorship from senior colleagues who demonstrate integrity"
      ],
      family_relationships: [
        "Have honest, loving conversation with family about your feelings",
        "Express gratitude for their concern while sharing your perspective",
        "Seek guidance from respected family elder or gurdwara committee member",
        "Pray together as family for Waheguru's guidance in decisions",
        "Practice patience and compassion during difficult conversations"
      ],
      mental_wellness: [
        "Establish morning routine with 15 minutes of Japji Sahib",
        "Practice 'Waheguru' simran during anxious moments",
        "Combine spiritual practice with professional mental health support if needed",
        "Connect with supportive sangat or spiritual mentor",
        "Create calming environment with Gurbani audio during rest"
      ],
      technology_balance: [
        "Replace morning phone check with 10 minutes of spiritual reading",
        "Set specific times for social media (not first/last thing daily)",
        "Install Gurbani apps and set spiritual reminders throughout day",
        "Practice 'digital seva' by sharing one positive/educational post daily",
        "Unfollow accounts that trigger comparison or negativity"
      ]
    };

    const steps = practicalSteps[intent.category] || practicalSteps.family_relationships;
    return steps.slice(0, 4); // Return top 4 most relevant steps
  },

  // Generate follow-up questions
  generateFollowUp(intent) {
    const followUpQuestions = {
      work_professional: [
        "Would you like guidance on having difficult conversations with your boss?",
        "How can we help you create a daily spiritual routine that fits your work schedule?",
        "Are there specific ethical concerns at your workplace you'd like to discuss?"
      ],
      family_relationships: [
        "Would you like help preparing for this conversation with your parents?",
        "How can we support you in finding common ground with your family?",
        "Are there cultural or religious aspects you'd like to explore further?"
      ],
      mental_wellness: [
        "Would you like guidance on establishing a consistent meditation practice?",
        "How can we help you find supportive sangat in your area?",
        "Are there specific triggers or situations you'd like to address?"
      ],
      technology_balance: [
        "Would you like help creating a digital wellness routine?",
        "How can we support you in using technology for spiritual growth?",
        "Are there specific social media challenges you'd like to address?"
      ]
    };

    const questions = followUpQuestions[intent.category] || followUpQuestions.family_relationships;
    return questions.slice(0, 2); // Return top 2 questions
  },

  // Generate closing blessing
  generateClosing() {
    const closings = [
      "May Guru Sahib's wisdom guide you through these challenges. Remember, you're not alone in this journey. 🙏",
      "Trust in Waheguru's plan while taking positive action. The sangat is here to support you. 🙏",
      "May the Guru's light illuminate your path forward. Keep faith and take it one step at a time. 🙏",
      "Waheguru is with you always. May you find peace and strength in the Guru's teachings. 🙏"
    ];

    return closings[Math.floor(Math.random() * closings.length)];
  },

  // Format final response for WhatsApp
  formatFinalResponse(response) {
    return `${response.greeting}

${response.empathy}

📖 *${response.gurbani.verse}*
_"${response.gurbani.translation}"_
— ${response.gurbani.reference}

💡 *${response.kathakar.source}*
"${response.kathakar.teaching}"

🛠️ *Practical Steps:*
${response.practical.map((step, index) => `${index + 1}. ${step}`).join('\n')}

❓ *Follow-up:*
${response.followUp.join('\n')}

${response.closing}`;
  }
};

module.exports = ResponseGenerator;
