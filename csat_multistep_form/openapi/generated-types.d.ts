/**
 * ⚠️  AUTO-GENERATED FILE - DO NOT MODIFY ⚠️
 *
 * This file contains TypeScript types generated from OpenAPI specifications.
 * Use these types for type-safe API development.
 */

export interface paths {
    "/survey-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new survey session
         * @description Start a new survey session. The server will initialize the session with the provided surveyId and split the survey into sequential steps (logical groups). Returns the created session with initial step and progress information.
         *
         */
        post: operations["createSurveySession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/survey-sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve survey session state
         * @description Retrieve the full session state, including answers preserved across steps and progress indicator.
         */
        get: operations["getSurveySession"];
        put?: never;
        post?: never;
        /**
         * Delete a survey session
         * @description Delete an existing survey session and all answers.
         */
        delete: operations["deleteSurveySession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/survey-sessions/{sessionId}/steps/{stepIndex}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a specific step in the session
         * @description Retrieve the contents of a specific step (logical group) within the session, including questions and any saved answers for that step.
         *
         */
        get: operations["getSessionStep"];
        /**
         * Save or update answers for a step
         * @description Persist answers for the specified step. Answers are preserved when navigating between steps. Returns updated session state and progress.
         *
         */
        put: operations["saveStepAnswers"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/survey-sessions/{sessionId}/navigate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Navigate between steps
         * @description Move the current step pointer forward or backward. The server will validate that answers for current step are preserved. Returns updated session state including currentStepIndex and progress.
         *
         */
        post: operations["navigateSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/survey-sessions/{sessionId}/progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get progress for a session
         * @description Return progress indicator information for the session (completed steps, total steps, percentage).
         */
        get: operations["getSessionProgress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorResponse: {
            code: string;
            message: string;
            details?: string;
            fieldErrors?: {
                field?: string;
                message?: string;
            }[];
        };
        SurveySession: {
            /** Format: uuid */
            id: string;
            surveyId: string;
            currentStepIndex: number;
            steps: components["schemas"]["Step"][];
            /** @description Collection of answers saved in the session across steps */
            answers?: components["schemas"]["Answer"][];
            progress: components["schemas"]["Progress"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        Step: {
            id: string;
            title: string;
            description?: string;
            questionIds: string[];
        };
        Answer: {
            questionId: string;
            /** @description Stored answer payload. Can be primitive, object or array depending on question type. */
            value: Record<string, never>;
            stepId?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt: string;
        };
        Progress: {
            completedSteps: number;
            totalSteps: number;
            percentage: number;
        };
        CreateSurveySessionRequest: {
            surveyId: string;
            initialAnswers?: components["schemas"]["Answer"][];
        };
        SessionStepResponse: {
            step: components["schemas"]["Step"];
            answers: components["schemas"]["Answer"][];
            currentStepIndex?: number;
            progress?: components["schemas"]["Progress"];
        };
        SaveStepAnswersRequest: {
            answers: components["schemas"]["Answer"][];
            /** @description Whether answers for other steps should be preserved (true by default behavior) */
            preserveOtherSteps?: boolean;
        };
        NavigateRequest: {
            /**
             * @description Direction of navigation: 'next' or 'previous'
             * @enum {string}
             */
            direction: "next" | "previous";
            /** @description Whether to validate required answers on the current step before navigating. */
            validateCurrentStep?: boolean;
        };
    };
    responses: {
        /** @description Invalid request */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Resource not found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Conflict (concurrent update or duplicate) */
        Conflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Validation failed */
        UnprocessableEntity: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    createSurveySession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSurveySessionRequest"];
            };
        };
        responses: {
            /** @description Survey session created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SurveySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            422: components["responses"]["UnprocessableEntity"];
        };
    };
    getSurveySession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SurveySession"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    deleteSurveySession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
        };
    };
    getSessionStep: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
                stepIndex: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Step retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionStepResponse"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    saveStepAnswers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
                stepIndex: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveStepAnswersRequest"];
            };
        };
        responses: {
            /** @description Answers saved and session updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SurveySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
        };
    };
    navigateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NavigateRequest"];
            };
        };
        responses: {
            /** @description Navigation successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SurveySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
        };
    };
    getSessionProgress: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Progress information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Progress"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
}
