// Test the complete AI system
const GurbaniAI = require('./src/ai-processing/gurbaniAI');

async function testGurbaniAI() {
  console.log('🧪 Testing Gurbani AI System...\n');
  
  // Initialize with your OpenAI API key
  const ai = new GurbaniAI(process.env.OPENAI_API_KEY);
  
  // Test queries
  const testQueries = [
    "I'm really stressed at work and my boss is being unfair",
    "I'm having problems with my teenage son, he doesn't listen",
    "I feel anxious and depressed, nothing seems to help",
    "I spend too much time on social media and it's affecting my spirituality"
  ];
  
  for (const query of testQueries) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TESTING: "${query}"`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
      const result = await ai.processUserQuery(query);
      console.log('RESPONSE:');
      console.log(result.response);
      console.log('\nMETADATA:');
      console.log(`Intent: ${result.metadata.intent?.category}`);
      console.log(`Verses found: ${result.metadata.gurbaniVerses?.length || 0}`);
      console.log(`Kathakar: ${result.metadata.kathakarWisdom?.name || 'None'}`);
    } catch (error) {
      console.error('Test failed:', error);
    }
    
    console.log('\n' + '-'.repeat(60));
  }
}

if (require.main === module) {
  testGurbaniAI();
}
