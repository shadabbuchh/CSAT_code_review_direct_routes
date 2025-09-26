import type { FastifyInstance } from 'fastify';
import { BaseService } from './base.service';
import { v4 as uuidv4 } from 'uuid';

interface SurveySession {
  id: string;
  surveyId: string;
  currentStepIndex: number;
  steps: Step[];
  answers?: Answer[];
  progress: Progress;
  createdAt: string;
  updatedAt: string;
}

interface Step {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
}

interface Answer {
  questionId: string;
  value: any;
  stepId?: string;
  createdAt?: string;
  updatedAt: string;
}

interface Progress {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
}

interface CreateSurveySessionRequest {
  surveyId: string;
  initialAnswers?: Answer[];
}

interface SaveStepAnswersRequest {
  answers: Answer[];
  preserveOtherSteps?: boolean;
}

interface NavigateRequest {
  direction: 'next' | 'previous';
  validateCurrentStep?: boolean;
}

// In-memory storage for demo purposes
const sessions = new Map<string, SurveySession>();

export class SurveySessionService extends BaseService<SurveySession, CreateSurveySessionRequest, Partial<SurveySession>> {
  protected entityName = 'SurveySession';

  constructor(private app: FastifyInstance) {
    super();
  }

  async createSession(data: CreateSurveySessionRequest): Promise<SurveySession> {
    const sessionId = uuidv4();
    
    // Mock survey steps based on surveyId
    const steps = this.generateMockSteps(data.surveyId);
    
    const session: SurveySession = {
      id: sessionId,
      surveyId: data.surveyId,
      currentStepIndex: 0,
      steps,
      answers: data.initialAnswers || [],
      progress: {
        completedSteps: 0,
        totalSteps: steps.length,
        percentage: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<SurveySession | null> {
    return sessions.get(sessionId) || null;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return sessions.delete(sessionId);
  }

  async getSessionStep(sessionId: string, stepIndex: number): Promise<any> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    if (stepIndex < 0 || stepIndex >= session.steps.length) {
      return null;
    }
    
    const step = session.steps[stepIndex];
    const stepAnswers = session.answers?.filter(a => a.stepId === step.id) || [];
    
    return {
      step,
      answers: stepAnswers,
      currentStepIndex: session.currentStepIndex,
      progress: session.progress
    };
  }

  async saveStepAnswers(sessionId: string, stepIndex: number, data: SaveStepAnswersRequest): Promise<SurveySession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    if (stepIndex < 0 || stepIndex >= session.steps.length) {
      return null;
    }
    
    const step = session.steps[stepIndex];
    
    // Update answers
    if (data.preserveOtherSteps !== false) {
      // Remove existing answers for this step
      session.answers = session.answers?.filter(a => a.stepId !== step.id) || [];
    } else {
      session.answers = [];
    }
    
    // Add new answers with step association
    const newAnswers = data.answers.map(answer => ({
      ...answer,
      stepId: step.id,
      updatedAt: new Date().toISOString()
    }));
    
    session.answers.push(...newAnswers);
    
    // Update progress
    const answeredSteps = new Set(session.answers.map(a => a.stepId)).size;
    session.progress.completedSteps = answeredSteps;
    session.progress.percentage = Math.round((answeredSteps / session.steps.length) * 100);
    
    session.updatedAt = new Date().toISOString();
    
    return session;
  }

  async navigateSession(sessionId: string, data: NavigateRequest): Promise<SurveySession | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    if (data.direction === 'next') {
      if (session.currentStepIndex < session.steps.length - 1) {
        session.currentStepIndex++;
      }
    } else if (data.direction === 'previous') {
      if (session.currentStepIndex > 0) {
        session.currentStepIndex--;
      }
    }
    
    session.updatedAt = new Date().toISOString();
    return session;
  }

  async getSessionProgress(sessionId: string): Promise<Progress | null> {
    const session = sessions.get(sessionId);
    if (!session) return null;
    
    return session.progress;
  }

  private generateMockSteps(surveyId: string): Step[] {
    // Generate mock steps based on surveyId
    if (surveyId.includes('customer')) {
      return [
        {
          id: 'step-1',
          title: 'Demographics',
          description: 'Tell us about yourself',
          questionIds: ['q1', 'q2', 'q3']
        },
        {
          id: 'step-2',
          title: 'Product Experience',
          description: 'Share your experience with our product',
          questionIds: ['q4', 'q5', 'q6']
        },
        {
          id: 'step-3',
          title: 'Feedback',
          description: 'Additional comments',
          questionIds: ['q7', 'q8']
        }
      ];
    }
    
    // Default steps
    return [
      {
        id: 'step-1',
        title: 'Getting Started',
        questionIds: ['q1', 'q2']
      },
      {
        id: 'step-2',
        title: 'Main Questions',
        questionIds: ['q3', 'q4']
      }
    ];
  }
}

export const makeSurveySessionService = (app: FastifyInstance) => {
  return new SurveySessionService(app);
};
