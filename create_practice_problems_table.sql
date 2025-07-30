-- Create practice_problems table in assessment schema
-- This table stores practice problems that students can work on

CREATE TABLE assessment.practice_problems (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    topic_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL DEFAULT 10,
    hint_text TEXT,
    hint_level INTEGER DEFAULT 1,
    solution_steps TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by BIGINT
);

-- Create supporting tables for collections
CREATE TABLE assessment.practice_problem_hints (
    problem_id BIGINT NOT NULL,
    hint_text TEXT,
    hint_order INTEGER,
    CONSTRAINT fk_practice_problem_hints_problem FOREIGN KEY (problem_id) REFERENCES assessment.practice_problems(id) ON DELETE CASCADE
);

CREATE TABLE assessment.practice_problem_similar (
    problem_id BIGINT NOT NULL,
    similar_problem_id BIGINT,
    CONSTRAINT fk_practice_problem_similar_problem FOREIGN KEY (problem_id) REFERENCES assessment.practice_problems(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_practice_problems_question_id ON assessment.practice_problems(question_id);
CREATE INDEX idx_practice_problems_topic_id ON assessment.practice_problems(topic_id);
CREATE INDEX idx_practice_problems_subject_id ON assessment.practice_problems(subject_id);
CREATE INDEX idx_practice_problems_is_active ON assessment.practice_problems(is_active);
CREATE INDEX idx_practice_problems_difficulty ON assessment.practice_problems(difficulty);
CREATE INDEX idx_practice_problems_type ON assessment.practice_problems(type);

-- Print confirmation
SELECT 'Practice problems table and supporting tables created successfully' as status;