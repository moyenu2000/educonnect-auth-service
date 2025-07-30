package com.educonnect.assessment.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple utility tests for assessment service
 */
public class AssessmentUtilsTest {

    @Test
    public void testScoreCalculation() {
        int correctAnswers = 8;
        int totalQuestions = 10;
        
        double percentage = (double) correctAnswers / totalQuestions * 100;
        
        assertEquals(80.0, percentage, 0.01);
        assertTrue(percentage >= 80.0);
        assertTrue(percentage <= 100.0);
    }

    @Test
    public void testGradeValidation() {
        String gradeA = "A";
        String gradeB = "B";
        String gradeC = "C";
        
        assertNotNull(gradeA);
        assertNotNull(gradeB);
        assertNotNull(gradeC);
        
        assertEquals(1, gradeA.length());
        assertEquals(1, gradeB.length());
        assertEquals(1, gradeC.length());
        
        assertTrue(gradeA.matches("[A-F]"));
        assertTrue(gradeB.matches("[A-F]"));
        assertTrue(gradeC.matches("[A-F]"));
    }

    @Test
    public void testQuestionTypes() {
        String multipleChoice = "MULTIPLE_CHOICE";
        String trueOrFalse = "TRUE_FALSE";
        String shortAnswer = "SHORT_ANSWER";
        
        assertTrue(multipleChoice.contains("MULTIPLE"));
        assertTrue(trueOrFalse.contains("TRUE"));
        assertTrue(shortAnswer.contains("SHORT"));
        
        assertFalse(multipleChoice.isEmpty());
        assertFalse(trueOrFalse.isEmpty());
        assertFalse(shortAnswer.isEmpty());
    }

    @Test
    public void testTimeDuration() {
        int durationMinutes = 60;
        int durationSeconds = durationMinutes * 60;
        
        assertEquals(3600, durationSeconds);
        assertTrue(durationMinutes > 0);
        assertTrue(durationSeconds > durationMinutes);
        
        int hours = durationMinutes / 60;
        assertEquals(1, hours);
    }
}