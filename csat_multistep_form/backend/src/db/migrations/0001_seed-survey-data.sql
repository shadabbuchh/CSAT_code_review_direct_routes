-- Seed data for survey sessions, steps, and answers
-- Demonstrates multi-step survey functionality with progress tracking

-- Insert sample survey sessions
INSERT INTO survey_sessions (id, survey_id, current_step_index, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'customer-satisfaction-2024', 0, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'customer-satisfaction-2024', 2, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'product-feedback-survey', 3, 'completed', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  (gen_random_uuid(), 'employee-engagement-q4', 1, 'active', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
  (gen_random_uuid(), 'market-research-study', 0, 'abandoned', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert survey steps for customer satisfaction survey
INSERT INTO survey_steps (id, session_id, step_id, title, description, question_ids, step_index, created_at, updated_at)
VALUES
  (gen_random_uuid(), 
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 0 LIMIT 1),
   'demographics',
   'About You',
   'Tell us a bit about yourself to help us better understand your feedback.',
   '["age_group", "location", "customer_type"]',
   0,
   CURRENT_TIMESTAMP,
   CURRENT_TIMESTAMP),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 0 LIMIT 1),
   'experience',
   'Your Experience',
   'Rate your recent experience with our products and services.',
   '["overall_satisfaction", "product_quality", "customer_service"]',
   1,
   CURRENT_TIMESTAMP,
   CURRENT_TIMESTAMP),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 0 LIMIT 1),
   'feedback',
   'Additional Feedback',
   'Share any additional thoughts or suggestions.',
   '["improvements", "recommendations", "likelihood_recommend"]',
   2,
   CURRENT_TIMESTAMP,
   CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert survey steps for active session at step 2
INSERT INTO survey_steps (id, session_id, step_id, title, description, question_ids, step_index, created_at, updated_at)
VALUES
  (gen_random_uuid(), 
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'demographics',
   'About You',
   'Tell us a bit about yourself to help us better understand your feedback.',
   '["age_group", "location", "customer_type"]',
   0,
   CURRENT_TIMESTAMP,
   CURRENT_TIMESTAMP),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'experience',
   'Your Experience',
   'Rate your recent experience with our products and services.',
   '["overall_satisfaction", "product_quality", "customer_service"]',
   1,
   CURRENT_TIMESTAMP,
   CURRENT_TIMESTAMP),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'feedback',
   'Additional Feedback',
   'Share any additional thoughts or suggestions.',
   '["improvements", "recommendations", "likelihood_recommend"]',
   2,
   CURRENT_TIMESTAMP,
   CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert survey steps for completed product feedback survey
INSERT INTO survey_steps (id, session_id, step_id, title, description, question_ids, step_index, created_at, updated_at)
VALUES
  (gen_random_uuid(), 
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'product_usage',
   'Product Usage',
   'Tell us about how you use our products.',
   '["primary_product", "usage_frequency", "use_cases"]',
   0,
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'feature_feedback',
   'Feature Feedback',
   'Rate the features you use most.',
   '["feature_satisfaction", "missing_features", "bug_reports"]',
   1,
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'future_needs',
   'Future Needs',
   'Help us understand what you need going forward.',
   '["roadmap_priorities", "integration_needs", "pricing_feedback"]',
   2,
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'final_thoughts',
   'Final Thoughts',
   'Any final comments or suggestions.',
   '["overall_experience", "testimonial", "contact_permission"]',
   3,
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert sample answers for completed survey
INSERT INTO survey_answers (id, session_id, step_id, question_id, value, created_at, updated_at)
VALUES
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'product_usage',
   'primary_product',
   '{"answer": "Enterprise Dashboard", "type": "single_choice"}',
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'product_usage',
   'usage_frequency',
   '{"answer": "Daily", "type": "single_choice"}',
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'product_usage',
   'use_cases',
   '{"answer": ["Analytics", "Reporting", "Team Collaboration"], "type": "multiple_choice"}',
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert answers for feature feedback step
INSERT INTO survey_answers (id, session_id, step_id, question_id, value, created_at, updated_at)
VALUES
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'feature_feedback',
   'feature_satisfaction',
   '{"answer": {"analytics": 5, "reporting": 4, "collaboration": 3}, "type": "rating_scale"}',
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'feature_feedback',
   'missing_features',
   '{"answer": "Better mobile app, real-time notifications, advanced filtering", "type": "text"}',
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'product-feedback-survey' LIMIT 1),
   'feature_feedback',
   'bug_reports',
   '{"answer": "Dashboard sometimes loads slowly on mobile devices", "type": "text"}',
   CURRENT_TIMESTAMP - INTERVAL '2 days',
   CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert answers for partially completed session (current_step_index = 2)
INSERT INTO survey_answers (id, session_id, step_id, question_id, value, created_at, updated_at)
VALUES
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'demographics',
   'age_group',
   '{"answer": "25-34", "type": "single_choice"}',
   CURRENT_TIMESTAMP - INTERVAL '15 minutes',
   CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'demographics',
   'location',
   '{"answer": "North America", "type": "single_choice"}',
   CURRENT_TIMESTAMP - INTERVAL '15 minutes',
   CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'experience',
   'overall_satisfaction',
   '{"answer": 4, "type": "rating", "scale": 5}',
   CURRENT_TIMESTAMP - INTERVAL '10 minutes',
   CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'customer-satisfaction-2024' AND current_step_index = 2 LIMIT 1),
   'experience',
   'product_quality',
   '{"answer": 5, "type": "rating", "scale": 5}',
   CURRENT_TIMESTAMP - INTERVAL '10 minutes',
   CURRENT_TIMESTAMP - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert steps for employee engagement survey
INSERT INTO survey_steps (id, session_id, step_id, title, description, question_ids, step_index, created_at, updated_at)
VALUES
  (gen_random_uuid(), 
   (SELECT id FROM survey_sessions WHERE survey_id = 'employee-engagement-q4' LIMIT 1),
   'job_satisfaction',
   'Job Satisfaction',
   'Rate your satisfaction with various aspects of your role.',
   '["role_satisfaction", "workload_balance", "growth_opportunities"]',
   0,
   CURRENT_TIMESTAMP - INTERVAL '1 hour',
   CURRENT_TIMESTAMP - INTERVAL '1 hour'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'employee-engagement-q4' LIMIT 1),
   'team_dynamics',
   'Team & Management',
   'Evaluate your team relationships and management support.',
   '["team_collaboration", "manager_support", "communication_effectiveness"]',
   1,
   CURRENT_TIMESTAMP - INTERVAL '1 hour',
   CURRENT_TIMESTAMP - INTERVAL '1 hour'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'employee-engagement-q4' LIMIT 1),
   'company_culture',
   'Company Culture',
   'Share your thoughts on company culture and values.',
   '["culture_alignment", "values_practice", "inclusion_belonging"]',
   2,
   CURRENT_TIMESTAMP - INTERVAL '1 hour',
   CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

--> statement-breakpoint

-- Insert answer for employee survey (currently on step 1)
INSERT INTO survey_answers (id, session_id, step_id, question_id, value, created_at, updated_at)
VALUES
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'employee-engagement-q4' LIMIT 1),
   'job_satisfaction',
   'role_satisfaction',
   '{"answer": 4, "type": "rating", "scale": 5}',
   CURRENT_TIMESTAMP - INTERVAL '45 minutes',
   CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'employee-engagement-q4' LIMIT 1),
   'job_satisfaction',
   'workload_balance',
   '{"answer": 3, "type": "rating", "scale": 5}',
   CURRENT_TIMESTAMP - INTERVAL '45 minutes',
   CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
  (gen_random_uuid(),
   (SELECT id FROM survey_sessions WHERE survey_id = 'employee-engagement-q4' LIMIT 1),
   'team_dynamics',
   'team_collaboration',
   '{"answer": 5, "type": "rating", "scale": 5}',
   CURRENT_TIMESTAMP - INTERVAL '30 minutes',
   CURRENT_TIMESTAMP - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;