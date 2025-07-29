-- Fix missing topic_id and subject_id in practice_problems
-- Update practice problems to get topic_id and subject_id from their associated questions

UPDATE assessment.practice_problems 
SET 
    topic_id = q.topic_id,
    subject_id = q.subject_id,
    difficulty = q.difficulty,
    type = q.type,
    points = q.points
FROM assessment.questions q 
WHERE practice_problems.question_id = q.id 
AND practice_problems.topic_id IS NULL;

-- Verify the update
SELECT 
    pp.id,
    pp.question_id,
    pp.topic_id,
    pp.subject_id,
    pp.difficulty,
    pp.type,
    pp.points,
    q.text as question_text
FROM assessment.practice_problems pp
JOIN assessment.questions q ON pp.question_id = q.id
ORDER BY pp.id;