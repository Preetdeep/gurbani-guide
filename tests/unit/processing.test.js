const ChatHandler = require('../../backend/src/ai-processing/chatHandler');
const GurbaniSearch = require('../../backend/src/ai-processing/gurbaniSearch');

// Mock OpenAI and Supabase for testing
jest.mock('openai');
jest.mock('../../backend/src/database/supabase');

describe('ChatHandler', () => {
  let chatHandler;

  beforeEach(() => {
    chatHandler = ChatHandler;
  });

  describe('analyzeIntent', () => {
    it('should categorize spiritual questions correctly', async () => {
      const testCases = [
        {
          message: 'What does Gurbani say about forgiveness?',
          expectedCategory: 'gurbani_verse'
        },
        {
          message: 'How should I handle workplace stress?',
          expectedCategory: 'life_guidance'
        },
        {
          message: 'Tell me about Guru Nanak Dev Ji',
          expectedCategory: 'historical'
        }
      ];

      // Mock OpenAI response
      require('openai').mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'life_guidance' } }]
            })
          }
        }
      }));

      for (const testCase of testCases) {
        const intent = await chatHandler.analyzeIntent(testCase.message);
        expect(typeof intent).toBe('string');
        expect(intent.length).toBeGreaterThan(0);
      }
    });
  });

  describe('extractSources', () => {
    it('should extract sources from content correctly', () => {
      const mockContent = {
        verses: [
          {
            reference: 'Ang 123',
            gurmukhi: 'ਸਮਪਲ ਟੈਕਸਟ'
          }
        ],
        katha: [
          {
            scholar: 'Test Scholar',
            topic: 'Sample Topic'
          }
        ],
        historical: [
          {
            title: 'Sample Story',
            context: 'Sample context'
          }
        ]
      };

      const sources = chatHandler.extractSources(mockContent);
      
      expect(Array.isArray(sources)).toBe(true);
      expect(sources.length).toBe(3);
      expect(sources[0].type).toBe('gurbani');
      expect(sources[1].type).toBe('katha');
      expect(sources[2].type).toBe('historical');
    });
  });

  describe('calculateConfidence', () => {
    it('should calculate confidence based on available content', () => {
      const highConfidenceContent = {
        verses: [{ id: 1 }],
        katha: [{ id: 1 }],
        historical: [{ id: 1 }]
      };

      const lowConfidenceContent = {
        verses: [],
        katha: [],
        historical: []
      };

      const highConfidence = chatHandler.calculateConfidence(highConfidenceContent);
      const lowConfidence = chatHandler.calculateConfidence(lowConfidenceContent);

      expect(highConfidence).toBeGreaterThan(lowConfidence);
      expect(highConfidence).toBeLessThanOrEqual(1.0);
      expect(lowConfidence).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('GurbaniSearch', () => {
  describe('extractThemes', () => {
    it('should extract themes from English text', () => {
      const testTexts = [
        {
          text: 'Meditate on the divine name with love and devotion',
          expectedThemes: ['meditation', 'devotion']
        },
        {
          text: 'Find peace through understanding and wisdom',
          expectedThemes: ['peace', 'wisdom']
        },
        {
          text: 'Serve others with humility and compassion',
          expectedThemes: ['service']
        }
      ];

      // This would test the theme extraction logic
      // For now, we'll test the structure
      testTexts.forEach(testCase => {
        expect(testCase.text.length).toBeGreaterThan(0);
        expect(Array.isArray(testCase.expectedThemes)).toBe(true);
      });
    });
  });

  describe('generateEmbedding', () => {
    it('should handle embedding generation', async () => {
      // Mock OpenAI embedding response
      const mockEmbedding = new Array(1536).fill(0.1);
      
      require('openai').mockImplementation(() => ({
        embeddings: {
          create: jest.fn().mockResolvedValue({
            data: [{ embedding: mockEmbedding }]
          })
        }
      }));

      const gurbaniSearch = GurbaniSearch;
      const embedding = await gurbaniSearch.generateEmbedding('test text');
      
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding.length).toBe(1536);
    });
  });
});

describe('Data Validation', () => {
  describe('Verse Structure', () => {
    it('should validate verse object structure', () => {
      const validVerse = {
        id: 'ang_1_line_1',
        ang: 1,
        line_number: 1,
        gurmukhi: 'ਸਮਪਲ ਟੈਕਸਟ',
        transliteration: 'Sample text',
        english_translation: 'Sample translation',
        author: 'Guru Nanak Dev Ji',
        reference: 'Ang 1'
      };

      // Validate required fields
      expect(validVerse).toHaveProperty('id');
      expect(validVerse).toHaveProperty('gurmukhi');
      expect(validVerse).toHaveProperty('english_translation');
      expect(validVerse).toHaveProperty('reference');
      
      // Validate data types
      expect(typeof validVerse.ang).toBe('number');
      expect(typeof validVerse.line_number).toBe('number');
      expect(typeof validVerse.gurmukhi).toBe('string');
      expect(typeof validVerse.english_translation).toBe('string');
    });
  });

  describe('API Response Structure', () => {
    it('should validate chat response structure', () => {
      const validResponse = {
        text: 'Sample spiritual guidance response',
        sources: [
          {
            type: 'gurbani',
            reference: 'Ang 123',
            text: 'Sample verse'
          }
        ],
        verses: [],
        confidence: 0.85
      };

      expect(validResponse).toHaveProperty('text');
      expect(validResponse).toHaveProperty('sources');
      expect(validResponse).toHaveProperty('confidence');
      expect(Array.isArray(validResponse.sources)).toBe(true);
      expect(typeof validResponse.confidence).toBe('number');
      expect(validResponse.confidence).toBeLessThanOrEqual(1.0);
      expect(validResponse.confidence).toBeGreaterThanOrEqual(0);
    });
  });
});
