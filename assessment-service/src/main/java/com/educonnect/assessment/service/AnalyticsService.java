package com.educonnect.assessment.service;

import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.repository.LiveExamRepository;
import com.educonnect.assessment.repository.ProblemSubmissionRepository;
import com.educonnect.assessment.repository.SubjectRepository;
import com.educonnect.assessment.repository.TopicRepository;
import com.educonnect.assessment.repository.UserSubmissionRepository;
import com.educonnect.assessment.repository.UserStreakRepository;
import com.educonnect.assessment.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    @Autowired
    private UserSubmissionRepository userSubmissionRepository;

    @Autowired
    private UserStreakRepository userStreakRepository;
    
    @Autowired
    private ProblemSubmissionRepository problemSubmissionRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private LiveExamRepository liveExamRepository;

    public Map<String, Object> getUserDashboard(Period period, Long subjectId) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("overview", getUserOverview(userId, period, subjectId));
        dashboard.put("streaks", getUserStreaks(userId, subjectId));
        Map<String, Object> performance = new HashMap<>();
        LocalDateTime startDate = getStartDateForPeriod(period);
        performance.put("accuracy", getAccuracyData(userId, subjectId, startDate));
        performance.put("speed", getSpeedData(userId, subjectId, startDate));
        performance.put("difficulty", getDifficultyData(userId, subjectId, startDate));
        performance.put("topics", getTopicData(userId, subjectId, startDate));
        performance.put("trends", getTrendData(userId, subjectId, startDate));
        dashboard.put("performance", performance);
        dashboard.put("rankings", getUserRankings(userId, subjectId));
        dashboard.put("recommendations", getUserRecommendations(userId, subjectId));

        return dashboard;
    }

    public Map<String, Object> getUserPerformance(Period period, Long subjectId, String type) {
        Long userId = SecurityUtils.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("User must be authenticated"));

        Map<String, Object> performance = new HashMap<>();
        LocalDateTime startDate = getStartDateForPeriod(period);
        
        performance.put("accuracy", getAccuracyData(userId, subjectId, startDate));
        performance.put("speed", getSpeedData(userId, subjectId, startDate));
        performance.put("difficulty", getDifficultyData(userId, subjectId, startDate));
        performance.put("topics", getTopicData(userId, subjectId, startDate));
        performance.put("trends", getTrendData(userId, subjectId, startDate));
        
        return performance;
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
        LocalDateTime startDate = getStartDateForPeriod(period);
        
        // Get simple counts for both types of submissions
        long totalUserSubmissions = userSubmissionRepository.countTotalSubmissionsByUserAndPeriod(userId, subjectId, startDate);
        long correctUserSubmissions = userSubmissionRepository.countCorrectSubmissionsByUserAndPeriod(userId, subjectId, startDate);
        
        long totalProblemSubmissions = problemSubmissionRepository.countTotalSubmissionsByUser(userId);
        long correctProblemSubmissions = problemSubmissionRepository.countCorrectSubmissionsByUser(userId);
        
        long totalQuestions = totalUserSubmissions + totalProblemSubmissions;
        long correctAnswers = correctUserSubmissions + correctProblemSubmissions;
        
        // Calculate real points
        Long userPoints = userSubmissionRepository.getTotalPointsByUserAndPeriod(userId, subjectId, startDate);
        Long problemPoints = problemSubmissionRepository.getTotalPointsByUser(userId, startDate);
        long totalPoints = (userPoints != null ? userPoints : 0) + (problemPoints != null ? problemPoints : 0);
        
        // Calculate average time
        Double userAvgTime = userSubmissionRepository.getAverageTimeByUserAndPeriod(userId, subjectId, startDate);
        Double problemAvgTime = problemSubmissionRepository.getAverageTimeByUser(userId);
        double averageTime = 0;
        if (userAvgTime != null && problemAvgTime != null) {
            averageTime = (userAvgTime + problemAvgTime) / 2;
        } else if (userAvgTime != null) {
            averageTime = userAvgTime;
        } else if (problemAvgTime != null) {
            averageTime = problemAvgTime;
        }
        
        overview.put("totalQuestions", totalQuestions);
        overview.put("correctAnswers", correctAnswers);
        overview.put("accuracy", totalQuestions > 0 ? Math.round((double) correctAnswers / totalQuestions * 100 * 100.0) / 100.0 : 0);
        overview.put("averageTime", Math.round(averageTime));
        overview.put("totalPoints", totalPoints);
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
        streaks.put("streakHistory", new ArrayList<>()); // Remove mock data - use real streak history if needed
        
        return streaks;
    }

    private Map<String, Object> getUserPerformance(Long userId, Period period, Long subjectId) {
        Map<String, Object> performance = new HashMap<>();
        LocalDateTime startDate = getStartDateForPeriod(period);
        
        performance.put("accuracy", getAccuracyData(userId, subjectId, startDate));
        performance.put("speed", getSpeedData(userId, subjectId, startDate));
        performance.put("difficulty", getDifficultyData(userId, subjectId, startDate));
        performance.put("topics", getTopicData(userId, subjectId, startDate));
        performance.put("trends", getTrendData(userId, subjectId, startDate));
        
        return performance;
    }

    private Map<String, Object> getUserRankings(Long userId, Long subjectId) {
        Map<String, Object> rankings = new HashMap<>();
        LocalDateTime startDate = getStartDateForPeriod(Period.ALL_TIME);
        
        // Calculate global rank based on points
        int globalRank = calculateGlobalRank(userId, startDate);
        rankings.put("globalRank", globalRank);
        
        // Subject-wise rankings
        rankings.put("subjectRanks", getSubjectRanks(userId, startDate));
        
        // Mock class rank (can be implemented with class/group system)
        rankings.put("classRank", globalRank % 50 + 1);
        
        // Calculate percentile
        rankings.put("percentile", calculatePercentile(globalRank));
        
        // Remove mock history - use real rank tracking if needed
        rankings.put("history", new ArrayList<>());
        
        return rankings;
    }

    private List<String> getUserRecommendations(Long userId, Long subjectId) {
        return getProgressRecommendations(userId, subjectId);
    }

    private Map<String, Object> getSkillProgress(Long userId, Long subjectId) {
        Map<String, Object> skillProgress = new HashMap<>();
        LocalDateTime startDate = getStartDateForPeriod(Period.MONTHLY);
        
        // Get real subject-wise accuracy data
        List<Object[]> subjectData = problemSubmissionRepository.getAccuracyBySubject(userId, startDate);
        for (Object[] row : subjectData) {
            String subjectName = (String) row[1];
            Long total = (Long) row[2];
            Long correct = (Long) row[3];
            double accuracy = total > 0 ? (double) correct / total * 100 : 0;
            skillProgress.put(subjectName.toLowerCase(), Math.round(accuracy));
        }
        
        return skillProgress;
    }

    private Map<String, Object> getTopicMastery(Long userId, Long subjectId) {
        Map<String, Object> topicMastery = new HashMap<>();
        LocalDateTime startDate = getStartDateForPeriod(Period.MONTHLY);
        
        // Get real topic-wise accuracy data
        List<Object[]> topicData = problemSubmissionRepository.getAccuracyByTopic(userId, subjectId, startDate);
        for (Object[] row : topicData) {
            String topicName = (String) row[1];
            Long total = (Long) row[2];
            Long correct = (Long) row[3];
            double accuracy = total > 0 ? (double) correct / total * 100 : 0;
            topicMastery.put(topicName.toLowerCase().replace(" ", ""), Math.round(accuracy));
        }
        
        return topicMastery;
    }

    private List<String> getWeakAreas(Long userId, Long subjectId) {
        LocalDateTime startDate = getStartDateForPeriod(Period.MONTHLY);
        List<Object[]> weakTopics = problemSubmissionRepository.getWeakTopics(userId, subjectId, startDate);
        
        return weakTopics.stream()
                .limit(5) // Top 5 weak areas
                .map(row -> (String) row[0])
                .collect(Collectors.toList());
    }

    private List<String> getStrongAreas(Long userId, Long subjectId) {
        LocalDateTime startDate = getStartDateForPeriod(Period.MONTHLY);
        List<Object[]> strongTopics = problemSubmissionRepository.getStrongTopics(userId, subjectId, startDate);
        
        return strongTopics.stream()
                .limit(5) // Top 5 strong areas
                .map(row -> (String) row[0])
                .collect(Collectors.toList());
    }

    private List<String> getProgressRecommendations(Long userId, Long subjectId) {
        List<String> recommendations = new ArrayList<>();
        LocalDateTime startDate = getStartDateForPeriod(Period.MONTHLY);
        
        // Get user's weak areas for recommendations
        List<String> weakAreas = getWeakAreas(userId, subjectId);
        
        if (!weakAreas.isEmpty()) {
            recommendations.add("Focus more practice on " + weakAreas.get(0) + " - your weakest topic");
        }
        
        // Check accuracy and suggest improvements
        long totalQuestions = problemSubmissionRepository.countTotalSubmissionsByUser(userId);
        long correctAnswers = problemSubmissionRepository.countCorrectSubmissionsByUser(userId);
        double accuracy = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0;
        
        if (accuracy < 70) {
            recommendations.add("Your overall accuracy is " + Math.round(accuracy) + "%. Try reviewing fundamentals before attempting harder problems");
        } else if (accuracy > 85) {
            recommendations.add("Great accuracy! Consider attempting more difficult problems to challenge yourself");
        }
        
        // Check average time
        Double avgTime = problemSubmissionRepository.getAverageTimeByUser(userId);
        if (avgTime != null && avgTime > 120) { // More than 2 minutes
            recommendations.add("Work on improving your problem-solving speed. Current average: " + Math.round(avgTime) + " seconds");
        }
        
        // Check streak
        Integer currentStreak = userStreakRepository.getTotalActiveStreak(userId);
        if (currentStreak != null && currentStreak < 3) {
            recommendations.add("Build a daily practice streak to improve consistency");
        }
        
        return recommendations;
    }

    // Real data generators
    private Map<String, Object> getAccuracyData(Long userId, Long subjectId, LocalDateTime startDate) {
        Map<String, Object> accuracy = new HashMap<>();
        
        // Overall accuracy combining both submission types
        long totalUserSubmissions = userSubmissionRepository.countTotalSubmissionsByUserAndPeriod(userId, subjectId, startDate);
        long correctUserSubmissions = userSubmissionRepository.countCorrectSubmissionsByUserAndPeriod(userId, subjectId, startDate);
        long totalProblemSubmissions = problemSubmissionRepository.countTotalSubmissionsByUser(userId);
        long correctProblemSubmissions = problemSubmissionRepository.countCorrectSubmissionsByUser(userId);
        
        long totalSubmissions = totalUserSubmissions + totalProblemSubmissions;
        long totalCorrect = correctUserSubmissions + correctProblemSubmissions;
        
        double overallAccuracy = totalSubmissions > 0 ? (double) totalCorrect / totalSubmissions * 100 : 0;
        accuracy.put("overall", Math.round(overallAccuracy * 100.0) / 100.0);
        
        // Accuracy by subject
        Map<String, Double> subjectAccuracy = new HashMap<>();
        List<Object[]> subjectData = problemSubmissionRepository.getAccuracyBySubject(userId, startDate);
        for (Object[] row : subjectData) {
            String subjectName = (String) row[1];
            Long total = (Long) row[2];
            Long correct = (Long) row[3];
            double acc = total > 0 ? (double) correct / total * 100 : 0;
            subjectAccuracy.put(subjectName.toLowerCase(), (double) Math.round(acc));
        }
        accuracy.put("bySubject", subjectAccuracy);
        
        // Simple trend analysis
        accuracy.put("trend", overallAccuracy > 75 ? "improving" : overallAccuracy > 50 ? "stable" : "needs_improvement");
        
        return accuracy;
    }

    private Map<String, Object> getSpeedData(Long userId, Long subjectId, LocalDateTime startDate) {
        Map<String, Object> speed = new HashMap<>();
        
        Double userAvgTime = userSubmissionRepository.getAverageTimeByUserAndPeriod(userId, subjectId, startDate);
        Double problemAvgTime = problemSubmissionRepository.getAverageTimeByUser(userId);
        
        double averageTime = 0;
        if (userAvgTime != null && problemAvgTime != null) {
            averageTime = (userAvgTime + problemAvgTime) / 2;
        } else if (userAvgTime != null) {
            averageTime = userAvgTime;
        } else if (problemAvgTime != null) {
            averageTime = problemAvgTime;
        }
        
        speed.put("averageTime", Math.round(averageTime));
        speed.put("improvement", averageTime < 60 ? 20 : averageTime < 120 ? 10 : 0); // Mock improvement
        speed.put("comparison", averageTime < 60 ? "above_average" : "average");
        
        return speed;
    }

    private Map<String, Object> getDifficultyData(Long userId, Long subjectId, LocalDateTime startDate) {
        Map<String, Double> difficulty = new HashMap<>();
        
        // Get difficulty-wise accuracy from problem submissions
        List<Object[]> difficultyData = problemSubmissionRepository.getAccuracyByDifficulty(userId, subjectId, startDate);
        for (Object[] row : difficultyData) {
            Difficulty diff = (Difficulty) row[0];
            Long total = (Long) row[1];
            Long correct = (Long) row[2];
            double accuracy = total > 0 ? (double) correct / total * 100 : 0;
            difficulty.put(diff.name().toLowerCase(), (double) Math.round(accuracy));
        }
        
        // Add default values for missing difficulties
        if (!difficulty.containsKey("easy")) difficulty.put("easy", 0.0);
        if (!difficulty.containsKey("medium")) difficulty.put("medium", 0.0);
        if (!difficulty.containsKey("hard")) difficulty.put("hard", 0.0);
        
        return new HashMap<>(Map.of(
            "easy", difficulty.get("easy"),
            "medium", difficulty.get("medium"),
            "hard", difficulty.get("hard")
        ));
    }

    private Map<String, Object> getTopicData(Long userId, Long subjectId, LocalDateTime startDate) {
        Map<String, Object> topics = new HashMap<>();
        
        List<String> strongAreas = getStrongAreas(userId, subjectId);
        List<String> weakAreas = getWeakAreas(userId, subjectId);
        
        topics.put("strongestTopic", strongAreas.isEmpty() ? "N/A" : strongAreas.get(0));
        topics.put("weakestTopic", weakAreas.isEmpty() ? "N/A" : weakAreas.get(0));
        
        // Topic mastery levels
        Map<String, Double> masteryLevels = new HashMap<>();
        List<Object[]> topicData = problemSubmissionRepository.getAccuracyByTopic(userId, subjectId, startDate);
        for (Object[] row : topicData) {
            String topicName = (String) row[1];
            Long total = (Long) row[2];
            Long correct = (Long) row[3];
            double accuracy = total > 0 ? (double) correct / total * 100 : 0;
            masteryLevels.put(topicName.toLowerCase().replace(" ", ""), (double) Math.round(accuracy));
        }
        topics.put("masteryLevels", masteryLevels);
        
        return topics;
    }

    private List<Map<String, Object>> getTrendData(Long userId, Long subjectId, LocalDateTime startDate) {
        List<Map<String, Object>> trends = new ArrayList<>();
        
        List<Object[]> dailyTrends = problemSubmissionRepository.getDailyTrends(userId, subjectId, startDate);
        for (Object[] row : dailyTrends) {
            Map<String, Object> trend = new HashMap<>();
            trend.put("date", row[0].toString());
            trend.put("questionsAnswered", ((Long) row[1]).intValue());
            
            Long total = (Long) row[1];
            Long correct = (Long) row[2];
            double accuracy = total > 0 ? (double) correct / total * 100 : 0;
            trend.put("accuracy", Math.round(accuracy));
            
            trends.add(trend);
        }
        
        return trends;
    }


    private List<Map<String, Object>> getSubjectRanks(Long userId, LocalDateTime startDate) {
        List<Map<String, Object>> ranks = new ArrayList<>();
        
        // Get all subjects the user has attempted
        List<Object[]> subjectData = problemSubmissionRepository.getAccuracyBySubject(userId, startDate);
        
        for (Object[] row : subjectData) {
            Long subjectId = (Long) row[0];
            String subjectName = (String) row[1];
            
            // Get subject-specific rankings
            List<Object[]> subjectRankings = problemSubmissionRepository.getSubjectRankings(subjectId, startDate);
            
            int userRank = 1;
            int totalUsers = subjectRankings.size();
            
            // Find user's rank in this subject
            for (int i = 0; i < subjectRankings.size(); i++) {
                Long rankedUserId = (Long) subjectRankings.get(i)[0];
                if (rankedUserId.equals(userId)) {
                    userRank = i + 1;
                    break;
                }
            }
            
            Map<String, Object> rank = new HashMap<>();
            rank.put("subject", subjectName);
            rank.put("rank", userRank);
            rank.put("totalUsers", Math.max(totalUsers, 10)); // Ensure minimum total users
            ranks.add(rank);
        }
        
        return ranks;
    }


    // Admin analytics with real database data only
    private Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get actual user counts from auth service/database
        // Note: These would typically come from the auth service
        // For now, returning actual counts that can be calculated
        
        // Total users who have made submissions (real data)
        long totalUsersWithSubmissions = userSubmissionRepository.countDistinctUsers();
        long totalUsersWithProblemSubmissions = problemSubmissionRepository.countDistinctUsers();
        long totalUniqueUsers = Math.max(totalUsersWithSubmissions, totalUsersWithProblemSubmissions);
        
        // Users active in last week (real data)
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        long activeUsersThisWeek = userSubmissionRepository.countActiveUsersInPeriod(weekAgo);
        long activeProblemUsersThisWeek = problemSubmissionRepository.countActiveUsersInPeriod(weekAgo);
        long totalActiveUsers = Math.max(activeUsersThisWeek, activeProblemUsersThisWeek);
        
        // New users this week (users who made their first submission this week)
        long newUsersThisWeek = userSubmissionRepository.countNewUsersInPeriod(weekAgo);
        
        stats.put("totalUsers", totalUniqueUsers);
        stats.put("activeUsers", totalActiveUsers);
        stats.put("newUsersThisWeek", newUsersThisWeek);
        stats.put("retentionRate", totalUniqueUsers > 0 ? 
            Math.round((double) totalActiveUsers / totalUniqueUsers * 100 * 100.0) / 100.0 : 0.0);
        
        return stats;
    }

    private Map<String, Object> getExamStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get real exam data from database queries
        long totalExams = liveExamRepository.countTotalExams();
        long activeExams = liveExamRepository.countActiveExams();
        long completedExams = liveExamRepository.countCompletedExams();
        
        // Calculate completion rate
        double completionRate = totalExams > 0 ? (double) completedExams / totalExams * 100 : 0.0;
        
        // Get average score from user submissions
        Double averageScore = userSubmissionRepository.getAverageScore();
        
        stats.put("totalExams", totalExams);
        stats.put("activeExams", activeExams);
        stats.put("completionRate", Math.round(completionRate * 100.0) / 100.0);
        stats.put("averageScore", averageScore != null ? Math.round(averageScore * 100.0) / 100.0 : 0.0);
        
        return stats;
    }

    private Map<String, Object> getPerformanceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Calculate real performance stats from our submissions data
        long totalSubmissions = userSubmissionRepository.getTotalSubmissions();
        long totalProblemSubmissions = problemSubmissionRepository.countTotalSubmissions();
        long allSubmissions = totalSubmissions + totalProblemSubmissions;
        
        // Calculate overall accuracy from real data
        long correctUserSubmissions = userSubmissionRepository.countCorrectSubmissionsByUserAndPeriod(
            null, null, getStartDateForPeriod(Period.ALL_TIME));
        long correctProblemSubmissions = problemSubmissionRepository.countCorrectSubmissions();
        long totalCorrect = correctUserSubmissions + correctProblemSubmissions;
        
        double overallAccuracy = allSubmissions > 0 ? (double) totalCorrect / allSubmissions * 100 : 0.0;
        
        // Get real average time from both submission types
        Double userAvgTime = userSubmissionRepository.getAverageTimeByUserAndPeriod(
            null, null, getStartDateForPeriod(Period.ALL_TIME));
        Double problemAvgTime = problemSubmissionRepository.getAverageTime();
        
        double averageTime = 0;
        if (userAvgTime != null && problemAvgTime != null) {
            averageTime = (userAvgTime + problemAvgTime) / 2;
        } else if (userAvgTime != null) {
            averageTime = userAvgTime;
        } else if (problemAvgTime != null) {
            averageTime = problemAvgTime;
        }
        
        // Get real difficulty distribution from problem submissions
        Map<String, Long> difficultyMap = problemSubmissionRepository.getDifficultyDistribution();
        Map<String, Integer> difficultyDistribution = new HashMap<>();
        long totalDifficultySubmissions = difficultyMap.values().stream().mapToLong(Long::longValue).sum();
        
        if (totalDifficultySubmissions > 0) {
            difficultyDistribution.put("easy", 
                (int) Math.round((double) difficultyMap.getOrDefault("EASY", 0L) / totalDifficultySubmissions * 100));
            difficultyDistribution.put("medium", 
                (int) Math.round((double) difficultyMap.getOrDefault("MEDIUM", 0L) / totalDifficultySubmissions * 100));
            difficultyDistribution.put("hard", 
                (int) Math.round((double) difficultyMap.getOrDefault("HARD", 0L) / totalDifficultySubmissions * 100));
            difficultyDistribution.put("expert", 
                (int) Math.round((double) difficultyMap.getOrDefault("EXPERT", 0L) / totalDifficultySubmissions * 100));
        } else {
            difficultyDistribution.put("easy", 0);
            difficultyDistribution.put("medium", 0);
            difficultyDistribution.put("hard", 0);
            difficultyDistribution.put("expert", 0);
        }
        
        stats.put("overallAccuracy", Math.round(overallAccuracy * 100.0) / 100.0);
        stats.put("averageTime", Math.round(averageTime));
        stats.put("difficultyDistribution", difficultyDistribution);
        
        return stats;
    }

    private Map<String, Object> getEngagementStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Real engagement stats from database
        LocalDateTime today = LocalDateTime.now().minusDays(1);
        long dailyActiveUsers = userSubmissionRepository.countActiveUsersInPeriod(today);
        long dailyProblemActiveUsers = problemSubmissionRepository.countActiveUsersInPeriod(today);
        long totalDailyActive = Math.max(dailyActiveUsers, dailyProblemActiveUsers);
        
        // Questions answered in the last day
        long dailyUserSubmissions = userSubmissionRepository.getSubmissionsInPeriod(today);
        long dailyProblemSubmissions = problemSubmissionRepository.getSubmissionsInPeriod(today);
        long questionsPerDay = dailyUserSubmissions + dailyProblemSubmissions;
        
        // Streak participation - users with active streaks
        long totalUsers = userSubmissionRepository.countDistinctUsers();
        long usersWithStreaks = userStreakRepository.countUsersWithActiveStreaks();
        double streakParticipation = totalUsers > 0 ? (double) usersWithStreaks / totalUsers * 100 : 0.0;
        
        // Average session time (estimated from average time per question)
        Double avgTimePerQuestion = userSubmissionRepository.getAverageTimeByUserAndPeriod(
            null, null, getStartDateForPeriod(Period.ALL_TIME));
        int avgSessionTime = avgTimePerQuestion != null ? 
            Math.max(5, Math.min(30, (int) (avgTimePerQuestion / 60 * 3))) : 10; // Convert to minutes, estimate 3 questions per session
        
        stats.put("dailyActiveUsers", totalDailyActive);
        stats.put("avgSessionTime", avgSessionTime);
        stats.put("questionsPerDay", questionsPerDay);
        stats.put("streakParticipation", Math.round(streakParticipation * 100.0) / 100.0);
        
        return stats;
    }

    // Helper methods
    private LocalDateTime getStartDateForPeriod(Period period) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case DAILY -> now.minusDays(1);
            case WEEKLY -> now.minusWeeks(1);
            case MONTHLY -> now.minusMonths(1);
            case YEARLY -> now.minusYears(1);
            case ALL_TIME -> LocalDateTime.of(2020, 1, 1, 0, 0); // Very old date
            default -> now.minusMonths(1);
        };
    }
    
    private int calculateGlobalRank(Long userId, LocalDateTime startDate) {
        // Get all users ranked by points (combining both submission types)
        List<Object[]> globalRankings = problemSubmissionRepository.getGlobalRankings(startDate);
        
        for (int i = 0; i < globalRankings.size(); i++) {
            Long rankedUserId = (Long) globalRankings.get(i)[0];
            if (rankedUserId.equals(userId)) {
                return i + 1;
            }
        }
        
        // If user not found in rankings, return a default based on user ID
        return Math.max(1, userId.intValue() % 1000 + 1);
    }
    
    private int calculateUserRank(Long userId) {
        return calculateGlobalRank(userId, getStartDateForPeriod(Period.ALL_TIME));
    }

    private int calculateUserLevel(Long userId) {
        // Calculate level based on total points earned
        Long totalPoints = problemSubmissionRepository.getTotalPointsByUser(userId, getStartDateForPeriod(Period.ALL_TIME));
        if (totalPoints == null) totalPoints = 0L;
        
        // Level calculation: every 100 points = 1 level
        return Math.max(1, (int) (totalPoints / 100) + 1);
    }

    private double calculatePercentile(int rank) {
        // Estimate percentile based on rank (assuming 1000 total users)
        return Math.max(10, 100 - ((double) rank / 10));
    }
}