import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface CreateSurveySessionRequest {
  Body: {
    surveyId: string;
    initialAnswers?: Array<{
      questionId: string;
      value: any;
      stepId?: string;
      createdAt?: string;
      updatedAt: string;
    }>;
  };
}

interface GetSurveySessionRequest {
  Params: {
    sessionId: string;
  };
}

interface DeleteSurveySessionRequest {
  Params: {
    sessionId: string;
  };
}

interface GetSessionStepRequest {
  Params: {
    sessionId: string;
    stepIndex: string;
  };
}

interface SaveStepAnswersRequest {
  Params: {
    sessionId: string;
    stepIndex: string;
  };
  Body: {
    answers: Array<{
      questionId: string;
      value: any;
      stepId?: string;
      createdAt?: string;
      updatedAt: string;
    }>;
    preserveOtherSteps?: boolean;
  };
}

interface NavigateSessionRequest {
  Params: {
    sessionId: string;
  };
  Body: {
    direction: 'next' | 'previous';
    validateCurrentStep?: boolean;
  };
}

interface GetSessionProgressRequest {
  Params: {
    sessionId: string;
  };
}

export default async function surveySessions(app: FastifyInstance) {
  // POST /survey-sessions - Create a new survey session
  app.post<CreateSurveySessionRequest>(
    '/survey-sessions',
    async (request: FastifyRequest<CreateSurveySessionRequest>, reply: FastifyReply) => {
      try {
        const session = await app.services.surveySession.createSession(request.body);
        return reply.code(201).send(session);
      } catch (error) {
        app.log.error(error);
        return reply.code(400).send({
          code: 'BAD_REQUEST',
          message: 'Failed to create survey session'
        });
      }
    }
  );

  // GET /survey-sessions/:sessionId - Retrieve survey session state
  app.get<GetSurveySessionRequest>(
    '/survey-sessions/:sessionId',
    async (request: FastifyRequest<GetSurveySessionRequest>, reply: FastifyReply) => {
      try {
        const session = await app.services.surveySession.getSession(request.params.sessionId);
        if (!session) {
          return reply.code(404).send({
            code: 'NOT_FOUND',
            message: 'Survey session not found'
          });
        }
        return reply.send(session);
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve survey session'
        });
      }
    }
  );

  // DELETE /survey-sessions/:sessionId - Delete a survey session
  app.delete<DeleteSurveySessionRequest>(
    '/survey-sessions/:sessionId',
    async (request: FastifyRequest<DeleteSurveySessionRequest>, reply: FastifyReply) => {
      try {
        const deleted = await app.services.surveySession.deleteSession(request.params.sessionId);
        if (!deleted) {
          return reply.code(404).send({
            code: 'NOT_FOUND',
            message: 'Survey session not found'
          });
        }
        return reply.code(204).send();
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete survey session'
        });
      }
    }
  );

  // GET /survey-sessions/:sessionId/steps/:stepIndex - Get a specific step in the session
  app.get<GetSessionStepRequest>(
    '/survey-sessions/:sessionId/steps/:stepIndex',
    async (request: FastifyRequest<GetSessionStepRequest>, reply: FastifyReply) => {
      try {
        const stepIndex = parseInt(request.params.stepIndex, 10);
        if (isNaN(stepIndex) || stepIndex < 0) {
          return reply.code(400).send({
            code: 'BAD_REQUEST',
            message: 'Invalid step index'
          });
        }

        const stepData = await app.services.surveySession.getSessionStep(
          request.params.sessionId,
          stepIndex
        );
        
        if (!stepData) {
          return reply.code(404).send({
            code: 'NOT_FOUND',
            message: 'Session or step not found'
          });
        }
        
        return reply.send(stepData);
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve session step'
        });
      }
    }
  );

  // PUT /survey-sessions/:sessionId/steps/:stepIndex - Save or update answers for a step
  app.put<SaveStepAnswersRequest>(
    '/survey-sessions/:sessionId/steps/:stepIndex',
    async (request: FastifyRequest<SaveStepAnswersRequest>, reply: FastifyReply) => {
      try {
        const stepIndex = parseInt(request.params.stepIndex, 10);
        if (isNaN(stepIndex) || stepIndex < 0) {
          return reply.code(400).send({
            code: 'BAD_REQUEST',
            message: 'Invalid step index'
          });
        }

        const session = await app.services.surveySession.saveStepAnswers(
          request.params.sessionId,
          stepIndex,
          request.body
        );
        
        if (!session) {
          return reply.code(404).send({
            code: 'NOT_FOUND',
            message: 'Session or step not found'
          });
        }
        
        return reply.send(session);
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to save step answers'
        });
      }
    }
  );

  // POST /survey-sessions/:sessionId/navigate - Navigate between steps
  app.post<NavigateSessionRequest>(
    '/survey-sessions/:sessionId/navigate',
    async (request: FastifyRequest<NavigateSessionRequest>, reply: FastifyReply) => {
      try {
        const session = await app.services.surveySession.navigateSession(
          request.params.sessionId,
          request.body
        );
        
        if (!session) {
          return reply.code(404).send({
            code: 'NOT_FOUND',
            message: 'Survey session not found'
          });
        }
        
        return reply.send(session);
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to navigate session'
        });
      }
    }
  );

  // GET /survey-sessions/:sessionId/progress - Get progress for a session
  app.get<GetSessionProgressRequest>(
    '/survey-sessions/:sessionId/progress',
    async (request: FastifyRequest<GetSessionProgressRequest>, reply: FastifyReply) => {
      try {
        const progress = await app.services.surveySession.getSessionProgress(
          request.params.sessionId
        );
        
        if (!progress) {
          return reply.code(404).send({
            code: 'NOT_FOUND',
            message: 'Survey session not found'
          });
        }
        
        return reply.send(progress);
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve session progress'
        });
      }
    }
  );
}
