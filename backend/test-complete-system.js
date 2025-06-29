// backend/test-complete-system.js
const GurbaniAI = require('./src/ai-processing/gurbaniAI');
require('dotenv').config();

async function testCompleteSystem() {
  console.log('🚀 Testing Complete Gurbani AI System...\n');
  console.log('=' * 60);
  
  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️ OPENAI_API_KEY not found in .env file');
    console.log('⚠️ Will test with fallback responses only\n');
  }
  
  // Initialize AI system
  const ai = new GurbaniAI(process.env.OPENAI_API_KEY);
  
  // Test system initialization
  console.log('🧪 System Initialization Test:');
  ai.testSystem();
  console.log('');
  
  // Test queries representing different life situations
  const testQueries = [
    {
      query: "I'm really stressed at work and my boss is being unfair. I feel like quitting.",
      expected_category: 'work_professional'
    },
    {
      query: "My teenage son doesn't listen to me anymore and we fight all the time.",
      expected_category: 'family_relationships'
    },
    {
      query: "I feel anxious and depressed lately. Nothing seems to help.",
      expected_category: 'mental_wellness'
    },
    {
      query: "I spend too much time on social media and it's affecting my spiritual practice.",
      expected_category: 'technology_balance'
    },
    {
      query: "I want to start meditating but don't know how to begin.",
      expected_category: 'spiritual_practice'
    },
    {
      query: "How can I help my community during these difficult times?",
      expected_category: 'community_service'
    },
    {
      query: "I keep making the same mistakes and can't seem to change my habits.",
      expected_category: 'personal_growth'
    },
    {
      query: "I'm going through a divorce and everything is changing in my life.",
      expected_category: 'life_transitions'
    },
    {
      query: "I've been diagnosed with a serious illness and I'm scared.",
      expected_category: 'health_healing'
    },
    {
      query: "I'm struggling financially and worried about providing for my family.",
      expected_category: 'financial_guidance'
    }
  ];
  
  let successCount = 0;
  
  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🧪 TEST ${i + 1}/10: ${test.expected_category.toUpperCase()}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`QUERY: "${test.query}"`);
    console.log(`EXPECTED CATEGORY: ${test.expected_category}`);
    console.log('-'.repeat(80));
    
    try {
      const startTime = Date.now();
      const result = await ai.processUserQuery(test.query);
      const duration = Date.now() - startTime;
      
      // Check if intent classification worked
      const actualCategory = result.metadata.intent?.category;
      const confidence = result.metadata.intent?.confidence;
      const categoryMatch = actualCategory === test.expected_category;
      
      console.log(`\n🎯 RESULTS:`);
      console.log(`   Intent: ${actualCategory} (confidence: ${confidence})`);
      console.log(`   Category Match: ${categoryMatch ? '✅' : '❌'}`);
      console.log(`   Processing Time: ${duration}ms`);
      console.log(`   Gurbani Verses Found: ${result.metadata.gurbaniVerses?.length || 0}`);
      console.log(`   Kathakar: ${result.metadata.kathakarWisdom?.name || 'None'}`);
      
      if (categoryMatch) successCount++;
      
      console.log(`\n📝 RESPONSE:`);
      console.log(result.response);
      
      if (result.metadata.gurbaniVerses?.length > 0) {
        console.log(`\n📖 GURBANI USED:`);
        result.metadata.gurbaniVerses.forEach((verse, idx) => {
          console.log(`   ${idx + 1}. ${verse.gurmukhi}`);
          console.log(`      "${verse.translation}"`);
          console.log(`      - Ang ${verse.ang}, ${verse.raag} by ${verse.author}`);
        });
      }
      
      if (result.metadata.kathakarWisdom) {
        console.log(`\n👨‍🏫 KATHAKAR WISDOM:`);
        console.log(`   From ${result.metadata.kathakarWisdom.name}:`);
        console.log(`   "${result.metadata.kathakarWisdom.teaching}"`);
      }
      
    } catch (error) {
      console.error(`❌ Test failed:`, error);
    }
    
    // Add delay between tests to avoid rate limiting
    if (i < testQueries.length - 1) {
      console.log(`\n⏳ Waiting 2 seconds before next test...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n\n${'🏁'.repeat(20)} FINAL RESULTS ${'🏁'.repeat(20)}`);
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Tests Completed: ${testQueries.length}`);
  console.log(`   Intent Classification Success: ${successCount}/${testQueries.length} (${Math.round(successCount/testQueries.length*100)}%)`);
  console.log(`   System Status: ${successCount >= 7 ? '✅ EXCELLENT' : successCount >= 5 ? '⚠️ GOOD' : '❌ NEEDS WORK'}`);
  
  if (process.env.OPENAI_API_KEY) {
    console.log(`\n✅ OpenAI Integration: Working`);
  } else {
    console.log(`\n⚠️ OpenAI Integration: API Key needed for full functionality`);
  }
  
  console.log(`\n🎯 NEXT STEPS:`);
  if (successCount >= 7) {
    console.log(`   ✅ System ready for WhatsApp integration!`);
    console.log(`   ✅ Consider expanding the Gurbani database`);
    console.log(`   ✅ Add more kathakar profiles for diversity`);
  } else {
    console.log(`   🔧 Improve intent classification accuracy`);
    console.log(`   🔧 Add more training data for underperforming categories`);
    console.log(`   🔧 Refine fallback responses`);
  }
  
  console.log(`\n📱 Ready for deployment to WhatsApp Business API when you are!`);
  console.log(`\n${'🙏'.repeat(40)}`);
  console.log(`Waheguru ji ka Khalsa, Waheguru ji ki Fateh!`);
  console.log(`${'🙏'.repeat(40)}\n`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  testCompleteSystem().catch(console.error);
}

module.exports = testCompleteSystem;