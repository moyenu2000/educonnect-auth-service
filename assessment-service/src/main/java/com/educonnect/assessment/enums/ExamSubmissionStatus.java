package com.educonnect.assessment.enums;

public enum ExamSubmissionStatus {
    DRAFT,      // For daily questions - submitted but not finalized
    SUBMITTED,  // For practice - immediately submitted and processed  
    FINALIZED   // For daily/contest - final submission with marks calculated
}