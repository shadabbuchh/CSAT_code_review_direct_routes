import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  timestamp,
  jsonb,
  text,
} from 'drizzle-orm/pg-core';

export const surveySessionStatus = pgEnum('survey_session_status', [
  'active',
  'completed',
  'abandoned',
]);

export const surveySessions = pgTable('survey_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  surveyId: varchar('survey_id', { length: 255 }).notNull(),
  currentStepIndex: integer('current_step_index').notNull().default(0),
  status: surveySessionStatus('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const surveySteps = pgTable('survey_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => surveySessions.id, { onDelete: 'cascade' }),
  stepId: varchar('step_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  questionIds: jsonb('question_ids').notNull(),
  stepIndex: integer('step_index').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const surveyAnswers = pgTable('survey_answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => surveySessions.id, { onDelete: 'cascade' }),
  stepId: varchar('step_id', { length: 255 }),
  questionId: varchar('question_id', { length: 255 }).notNull(),
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
