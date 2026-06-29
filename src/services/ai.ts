/**
 * Interface representing the core capabilities of the Astraiv AI engine.
 * This contract isolates the application logic from the underlying AI providers
 * (such as Gemini, OpenAI, or Anthropic).
 */

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

export interface AIService {
  /**
   * Generates a text completion based on a simple prompt.
   */
  generateText(prompt: string, options?: AIGenerateOptions): Promise<string>;

  /**
   * Generates structured JSON data conforming to a specific template.
   */
  generateStructuredData<T>(prompt: string, schema: string, options?: AIGenerateOptions): Promise<T>;

  /**
   * Handles multi-turn chat conversations.
   */
  chat(messages: AIChatMessage[], options?: AIGenerateOptions): Promise<string>;
}

/**
 * Mock implementation of the AI Service for development.
 * Emulates latencies and structures for CRM, ticket support, and copywriting.
 */
export class MockAIService implements AIService {
  async generateText(prompt: string, options?: AIGenerateOptions): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // emulate latency
    
    if (prompt.toLowerCase().includes('ticket') || prompt.toLowerCase().includes('support')) {
      return '[AI Agent Summary]: The client is requesting database migrations for their active staging environments. Priority appears high as it is blocking front-end integration.';
    }
    
    return `[AI Response placeholder for prompt: "${prompt.substring(0, 30)}..."] This is a premium AI-generated response. The system is ready to be swapped with Google Gemini API.`;
  }

  async generateStructuredData<T>(prompt: string, schema: string, options?: AIGenerateOptions): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Stub returns based on typical CRM classifications
    const stubResult = {
      leadScore: 88,
      interestClassification: 'HIGH_INTENT',
      suggestedNextSteps: ['Send API proposal brochure', 'Schedule technical discovery call'],
      estimatedBudgetRange: '$15,000 - $25,000',
    };
    
    return stubResult as unknown as T;
  }

  async chat(messages: AIChatMessage[], options?: AIGenerateOptions): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const lastMessage = messages[messages.length - 1]?.content || '';
    return `[Astraiv Assistant]: I've processed your request regarding "${lastMessage.substring(0, 40)}". How else can I assist you with your software automation plans today?`;
  }
}

// Singleton export of the AI Service.
// In production, instantiate the actual Gemini or OpenAI provider client here.
export const ai = new MockAIService();
