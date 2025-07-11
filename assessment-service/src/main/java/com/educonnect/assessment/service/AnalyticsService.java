package com.educonnect.assessment.service;

import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.repository.UserSubmissionRepository;
import com.educonnect.assessment.repository.UserStreakRepository;
import com.educonnect.assessment.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    @Autowired
    private UserSubmissionRepository userSubmissionRepository;

    @Autowired
    private UserStreakRepository userStreakRepository;

    public Map<String, Object> getUserDashboard(Period period, Long subjectId) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("overview", getUserOverview(userId, period, subjectId));
        dashboard.put("streaks", getUserStreaks(userId, subjectId));
        dashboard.put("performance", getUserPerformance(userId, period, subjectId));
        dashboard.put("rankings", getUserRankings(userId, subjectId));
        dashboard.put("recommendations", getUserRecommendations(userId, subjectId));

        return dashboard;
    }

    public Map<String, Object> getUserPerformance(Period period, Long subjectId, String type) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        return getUserPerformance(userId, period, subjectId);
    }

    public Map<String, Object> getUserProgress(Long subjectId, Period period) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        Map<String, Object> progress = new HashMap<>();
        progress.put("skillProgress", getSkillProgress(userId, subjectId));
        progress.put("topicMastery", getTopicMastery(userId, subjectId));
        progress.put("weakAreas", getWeakAreas(userId, subjectId));
        progress.put("strongAreas", getStrongAreas(userId, subjectId));
        progress.put("recommendations", getProgressRecommendations(userId, subjectId));

        return progress;
    }

    public Map<String, Object> getUserRankings(String type, Long subjectId, Period period) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        return getUserRankings(userId, subjectId);
    }

    // Admin analytics
    public Map<String, Object> getAdminAnalytics(Period period, String type) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("userStats", getUserStats());
        analytics.put("examStats", getExamStats());
        analytics.put("performanceStats", getPerformanceStats());
        analytics.put("engagementStats", getEngagementStats());

        return analytics;
    }

    private Map<String, Object> getUserOverview(Long userId, Period period, Long subjectId) {
        Map<String, Object> overview = new HashMap<>();
        
        long totalQuestions = userSubmissionRepository.countTotalDailyAnswers(userId);
        long correctAnswers = userSubmissionRepository.countCorrectDailyAnswers(userId);
        
        overview.put("totalQuestions", totalQuestions);
        overview.put("correctAnswers", correctAnswers);
        overview.put("accuracy", totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0);
        overview.put("totalPoints", correctAnswers * 10); // Mock points calculation
        overview.put("rank", calculateUserRank(userId));
        overview.put("level", calculateUserLevel(userId));
        
        return overview;
    }

    private Map<String, Object> getUserStreaks(Long userId, Long subjectId) {
        Map<String, Object> streaks = new HashMap<>();
        
        Integer totalStreak = userStreakRepository.getTotalActiveStreak(userId);
        if (totalStreak == null) totalStreak = 0;
        
        streaks.put("currentStreak", totalStreak);
        streaks.put("longestStreak", userStreakRepository.findLongestStreakByUser(userId)
                .map(s -> s.getLongestStreak()).orElse(0));
        streaks.put("streakHistory", generateMockStreakHistory());
        
        return streaks;
    }

    private Map<String, Object> getUserPerformance(Long userId, Period period, Long subjectId) {
        Map<String, Object> performance = new HashMap<>();
        
        // Mock performance data
        performance.put("accuracy", generateAccuracyData());
        performance.put("speed", generateSpeedData());
        performance.put("difficulty", generateDifficultyData());
        performance.put("topics", generateTopicData());
        performance.put("trends", generateTrendData());
        
        return performance;
    }

    private Map<String, Object> getUserRankings(Long userId, Long subjectId) {
        Map<String, Object> rankings = new HashMap<>();
        
        rankings.put("globalRank", calculateUserRank(userId));
        rankings.put("subjectRanks", generateSubjectRanks(userId));
        rankings.put("classRank", calculateUserRank(userId) % 50 + 1);
        rankings.put("percentile", calculatePercentile(userId));
        rankings.put("history", generateRankHistory());
        
        return rankings;
    }

    private List<String> getUserRecommendations(Long userId, Long subjectId) {
        List<String> recommendations = new ArrayList<>();
        recommendations.add("Practice more difficult questions to improve your ranking");
        recommendations.add("Focus on Mathematics - your weakest subject");
        recommendations.add("Maintain your daily streak for better performance");
        return recommendations;
    }

    private Map<String, Object> getSkillProgress(Long userId, Long subjectId) {
        Map<String, Object> skillProgress = new HashMap<>();
        skillProgress.put("mathematics", 75);
        skillProgress.put("science", 82);
        skillProgress.put("english", 68);
        skillProgress.put("history", 90);
        return skillProgress;
    }

    private Map<String, Object> getTopicMastery(Long userId, Long subjectId) {
        Map<String, Object> topicMastery = new HashMap<>();
        topicMastery.put("algebra", 85);
        topicMastery.put("geometry", 70);
        topicMastery.put("physics", 78);
        topicMastery.put("chemistry", 92);
        return topicMastery;
    }

    private List<String> getWeakAreas(Long userId, Long subjectId) {
        List<String> weakAreas = new ArrayList<>();
        weakAreas.add("Quadratic Equations");
        weakAreas.add("Organic Chemistry");
        weakAreas.add("Grammar Rules");
        return weakAreas;
    }

    private List<String> getStrongAreas(Long userId, Long subjectId) {
        List<String> strongAreas = new ArrayList<>();
        strongAreas.add("Linear Equations");
        strongAreas.add("Physics Laws");
        strongAreas.add("Historical Events");
        return strongAreas;
    }

    private List<String> getProgressRecommendations(Long userId, Long subjectId) {
        return getUserRecommendations(userId, subjectId);
    }

    // Mock data generators
    private Map<String, Object> generateAccuracyData() {
        Map<String, Object> accuracy = new HashMap<>();
        accuracy.put("overall", 78.5);
        accuracy.put("bySubject", Map.of("math", 75, "science", 82, "english", 68));
        accuracy.put("trend", "improving");
        return accuracy;
    }

    private Map<String, Object> generateSpeedData() {
        Map<String, Object> speed = new HashMap<>();
        speed.put("averageTime", 45); // seconds
        speed.put("improvement", 15); // percentage
        speed.put("comparison", "above_average");
        return speed;
    }

    private Map<String, Object> generateDifficultyData() {
        Map<String, Object> difficulty = new HashMap<>();
        difficulty.put("easy", 95);
        difficulty.put("medium", 75);
        difficulty.put("hard", 45);
        difficulty.put("expert", 20);
        return difficulty;
    }

    private Map<String, Object> generateTopicData() {
        Map<String, Object> topics = new HashMap<>();
        topics.put("strongestTopic", "Linear Algebra");
        topics.put("weakestTopic", "Quadratic Equations");
        topics.put("masteryLevels", Map.of("algebra", 75, "geometry", 68, "calculus", 52));
        return topics;
    }

    private List<Map<String, Object>> generateTrendData() {
        List<Map<String, Object>> trends = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Map<String, Object> trend = new HashMap<>();
            trend.put("date", "2024-01-" + (i + 1));
            trend.put("accuracy", 70 + i * 2);
            trend.put("questionsAnswered", 10 + i);
            trends.add(trend);
        }
        return trends;
    }

    private List<Map<String, Object>> generateMockStreakHistory() {
        List<Map<String, Object>> history = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            Map<String, Object> day = new HashMap<>();
            day.put("date", "2024-01-" + (i + 1));
            day.put("completed", i % 7 != 0); // Skip Sundays
            day.put("score", i % 7 != 0 ? 80 + (i % 20) : 0);
            history.add(day);
        }
        return history;
    }

    private List<Map<String, Object>> generateSubjectRanks(Long userId) {
        List<Map<String, Object>> ranks = new ArrayList<>();
        String[] subjects = {"Mathematics", "Science", "English", "History"};
        for (int i = 0; i < subjects.length; i++) {
            Map<String, Object> rank = new HashMap<>();
            rank.put("subject", subjects[i]);
            rank.put("rank", (userId.intValue() + i) % 100 + 1);
            rank.put("totalUsers", 1000);
            ranks.add(rank);
        }
        return ranks;
    }

    private List<Map<String, Object>> generateRankHistory() {
        List<Map<String, Object>> history = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", "2024-01-" + (i + 1));
            entry.put("rank", 50 + (i % 10));
            entry.put("change", i % 3 == 0 ? "up" : i % 3 == 1 ? "down" : "same");
            history.add(entry);
        }
        return history;
    }

    // Admin mock data
    private Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", 10000);
        stats.put("activeUsers", 8500);
        stats.put("newUsersThisWeek", 150);
        stats.put("retentionRate", 85.5);
        return stats;
    }

    private Map<String, Object> getExamStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalExams", 500);
        stats.put("activeExams", 25);
        stats.put("completionRate", 78.2);
        stats.put("averageScore", 76.5);
        return stats;
    }

    private Map<String, Object> getPerformanceStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("overallAccuracy", 74.8);
        stats.put("averageTime", 42);
        stats.put("difficultyDistribution", Map.of("easy", 40, "medium", 35, "hard", 20, "expert", 5));
        return stats;
    }

    private Map<String, Object> getEngagementStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("dailyActiveUsers", 2500);
        stats.put("avgSessionTime", 25); // minutes
        stats.put("questionsPerDay", 15000);
        stats.put("streakParticipation", 65.8);
        return stats;
    }

    // Helper methods
    private int calculateUserRank(Long userId) {
        return userId.intValue() % 100 + 1;
    }

    private int calculateUserLevel(Long userId) {
        return (userId.intValue() % 50) + 1;
    }

    private double calculatePercentile(Long userId) {
        return Math.max(100 - (userId % 100), 10);
    }
}