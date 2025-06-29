// scripts/create-manual-database.js
const fs = require('fs');
const path = require('path');

class ManualGurbaniBuilder {
  constructor() {
    this.gurbaniDatabase = {
      work_professional: [],
      family_relationships: [],
      mental_wellness: [],
      technology_balance: [],
      spiritual_practice: [],
      community_service: [],
      personal_growth: [],
      life_transitions: [],
      health_healing: [],
      financial_guidance: []
    };
  }

  buildDatabase() {
    console.log('🔨 Building manual Gurbani database with key verses...');

    // Work & Professional Life
    this.gurbaniDatabase.work_professional = [
      {
        id: 'work_001',
        gurmukhi: 'ਕਰਮੀ ਆਵੈ ਕਪੜਾ ਨਦਰੀ ਮੋਖੁ ਦੁਆਰੁ',
        pronunciation: 'karmee aavai kaparraa nadaree mokh duaar',
        translation: 'Through karma, comes the robe of honor; through His Grace, the door of liberation.',
        translation_by: 'Sant Singh Khalsa',
        ang: 8,
        raag: 'Japji Sahib',
        author: 'Guru Nanak Dev Ji',
        category: ['work_ethics', 'karma', 'effort'],
        modern_context: 'Hard work and ethical conduct in professional life leads to success, but ultimate fulfillment comes through divine grace.',
        practical_advice: 'Work diligently and honestly, but remember that results are in God\'s hands. Do your best and leave the rest to Waheguru.',
        relevance_score: 10
      },
      {
        id: 'work_002', 
        gurmukhi: 'ਘਾਲਿ ਖਾਇ ਕਿਛੁ ਹਥਹੁ ਦੇਇ ਨਾਨਕ ਰਾਹੁ ਪਛਾਣਹਿ ਸੇਇ',
        pronunciation: 'ghaal khaae kichh hathahu dei naanak raahu pachaanahi sei',
        translation: 'One who works for what they eat, and gives some of what they earn - O Nanak, they know the Path.',
        translation_by: 'Sant Singh Khalsa',
        ang: 1245,
        raag: 'Sarang',
        author: 'Guru Nanak Dev Ji',
        category: ['honest_work', 'sharing', 'righteousness'],
        modern_context: 'Honest earning and sharing with others is the foundation of righteous living.',
        practical_advice: 'Earn through honest means, avoid shortcuts or unethical practices, and always share your blessings with those in need.',
        relevance_score: 9
      }
    ];

    // Family Relationships
    this.gurbaniDatabase.family_relationships = [
      {
        id: 'family_001',
        gurmukhi: 'ਮਾਤ ਪਿਤਾ ਕੀ ਸੇਵਾ ਕਰੇ ਅੰਤ ਕਾਲਿ ਨ ਛੋਡੈ ਸੰਗੁ',
        pronunciation: 'maat pitaa kee sevaa kare ant kaal na chhodai sang',
        translation: 'One who serves their mother and father - their company shall not leave them even at the time of death.',
        translation_by: 'Sant Singh Khalsa',
        ang: 1200,
        raag: 'Sarang',
        author: 'Guru Arjan Dev Ji',
        category: ['parents', 'seva', 'duty'],
        modern_context: 'Caring for elderly parents is a sacred duty that brings spiritual merit and peace.',
        practical_advice: 'Make time for your parents despite busy schedules. Their blessings and wisdom are invaluable for your spiritual journey.',
        relevance_score: 10
      }
    ];

    // Mental Wellness
    this.gurbaniDatabase.mental_wellness = [
      {
        id: 'mental_001',
        gurmukhi: 'ਸਰਬ ਰੋਗ ਕਾ ਔਖਦੁ ਨਾਮੁ',
        pronunciation: 'sarab rog kaa aukhadh naam',
        translation: 'The Name of the Lord is the medicine for all diseases.',
        translation_by: 'Sant Singh Khalsa',
        ang: 274,
        raag: 'Gauri',
        author: 'Guru Arjan Dev Ji',
        category: ['healing', 'naam', 'stress_relief'],
        modern_context: 'Mental health issues like anxiety and depression can be helped through spiritual practice and remembering God.',
        practical_advice: 'When feeling anxious or depressed, spend time in Naam Simran. Even 10 minutes of meditation can bring significant relief.',
        relevance_score: 10
      }
    ];

    // Technology Balance
    this.gurbaniDatabase.technology_balance = [
      {
        id: 'tech_001',
        gurmukhi: 'ਮਾਇਆ ਮੋਹਣੀ ਮੋਹਿਆ ਮੋਹਣੀ ਮੋਹੈ ਮਾਇ',
        pronunciation: 'maiaa mohanee mohiaa mohanee mohai maai',
        translation: 'Maya is fascinating and deluding; the fascinating Maya has fascinated my mind.',
        translation_by: 'Sant Singh Khalsa',
        ang: 921,
        raag: 'Ramkali',
        author: 'Guru Nanak Dev Ji',
        category: ['maya', 'distraction', 'attachment'],
        modern_context: 'Social media and digital devices can be like Maya - fascinating but ultimately distracting from spiritual growth.',
        practical_advice: 'Set boundaries with technology. Designate phone-free times for prayer, family, and reflection.',
        relevance_score: 8
      }
    ];

    // Spiritual Practice
    this.gurbaniDatabase.spiritual_practice = [
      {
        id: 'spiritual_001',
        gurmukhi: 'ਅੰਮ੍ਰਿਤ ਵੇਲਾ ਸਚੁ ਨਾਉ ਵਡਿਆਈ ਵੀਚਾਰੁ',
        pronunciation: 'amrit velaa sach naau vadiaaee veechaar',
        translation: 'In the Amrit Vela, the ambrosial hours before dawn, chant the True Name, and contemplate His Glorious Greatness.',
        translation_by: 'Sant Singh Khalsa',
        ang: 2,
        raag: 'Japji Sahib',
        author: 'Guru Nanak Dev Ji',
        category: ['amrit_vela', 'meditation', 'daily_practice'],
        modern_context: 'Starting the day with spiritual practice sets a positive tone and connects us with the divine.',
        practical_advice: 'Wake up early for meditation and prayer. Even 15-20 minutes can transform your entire day.',
        relevance_score: 10
      }
    ];

    // Add other categories with basic entries
    this.gurbaniDatabase.community_service = [{
      id: 'seva_001',
      gurmukhi: 'ਸਰਬੈ ਸੇਵਹਿ ਸੋ ਸੁਖੁ ਪਾਵੈ',
      pronunciation: 'sarbai sevahi so sukh paavai',
      translation: 'One who serves all beings finds peace.',
      ang: 26,
      raag: 'Siree Raag',
      author: 'Guru Nanak Dev Ji',
      modern_context: 'Serving others brings inner peace and fulfillment.',
      practical_advice: 'Look for opportunities to help others in your community.',
      relevance_score: 9
    }];

    this.gurbaniDatabase.personal_growth = [{
      id: 'growth_001',
      gurmukhi: 'ਪਹਿਲੇ ਮਨ ਕਾ ਝੂਠਾ ਕਬਰਾਉ',
      pronunciation: 'pahile man kaa jhootha kabraau',
      translation: 'First, remove the falsehood of the mind.',
      ang: 728,
      raag: 'Tilang',
      author: 'Guru Nanak Dev Ji',
      modern_context: 'Personal growth requires honest self-reflection and removing false beliefs.',
      practical_advice: 'Regularly examine your thoughts and motivations for truth and authenticity.',
      relevance_score: 8
    }];

    this.gurbaniDatabase.life_transitions = [{
      id: 'transition_001',
      gurmukhi: 'ਜੋ ਤਿਸੁ ਭਾਵੈ ਸੋਈ ਹੁਸੀ',
      pronunciation: 'jo tis bhaavai soee husee',
      translation: 'Whatever pleases Him shall happen.',
      ang: 1239,
      raag: 'Sarang',
      author: 'Guru Arjan Dev Ji',
      modern_context: 'Accepting divine will brings peace during life changes.',
      practical_advice: 'Focus on what you can control and surrender the rest.',
      relevance_score: 9
    }];

    this.gurbaniDatabase.health_healing = [{
      id: 'health_001',
      gurmukhi: 'ਤਨੁ ਮਨੁ ਧਨੁ ਸਭੁ ਸਉਪਿ ਗੁਰ ਕਉ',
      pronunciation: 'tan man dhan sabh saupi gur kau',
      translation: 'Surrender body, mind and wealth to the Guru.',
      ang: 918,
      raag: 'Ramkali',
      author: 'Guru Amar Das Ji',
      modern_context: 'Health challenges require both medical care and spiritual surrender.',
      practical_advice: 'Seek proper treatment while maintaining faith in divine will.',
      relevance_score: 8
    }];

    this.gurbaniDatabase.financial_guidance = [{
      id: 'financial_001',
      gurmukhi: 'ਸੰਤੋਖੁ ਸਰਬ ਰੋਗ ਕਾ ਔਖਦੁ',
      pronunciation: 'santokh sarab rog kaa aukhadh',
      translation: 'Contentment is the medicine for all ailments.',
      ang: 1138,
      raag: 'Bhairon',
      author: 'Guru Arjan Dev Ji',
      modern_context: 'Financial stress comes from endless desires. Contentment brings peace.',
      practical_advice: 'Practice gratitude and live within your means.',
      relevance_score: 9
    }];

    return this.gurbaniDatabase;
  }

  saveDatabase() {
    const outputDir = path.join(__dirname, '../data/gurbani/processed');
    const outputFile = path.join(outputDir, 'manual_gurbani_database.json');
    
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save the database
    fs.writeFileSync(outputFile, JSON.stringify(this.gurbaniDatabase, null, 2));
    
    console.log('✅ Manual Gurbani database saved successfully!');
    console.log(`📍 Location: ${outputFile}`);
    console.log('\n📊 Database Statistics:');
    
    Object.keys(this.gurbaniDatabase).forEach(category => {
      const count = this.gurbaniDatabase[category].length;
      console.log(`   ${category}: ${count} verses`);
    });

    const totalVerses = Object.values(this.gurbaniDatabase).reduce((sum, cat) => sum + cat.length, 0);
    console.log(`\n🎯 Total verses: ${totalVerses}`);
    
    return outputFile;
  }
}

// Execute if run directly
if (require.main === module) {
  const builder = new ManualGurbaniBuilder();
  const database = builder.buildDatabase();
  const savedPath = builder.saveDatabase();
  
  console.log('\n🚀 Manual Gurbani database creation complete!');
  console.log('🔄 Next step: Test the AI system with this data');
}

module.exports = ManualGurbaniBuilder;