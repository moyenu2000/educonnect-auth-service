package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.Period;
import com.educonnect.assessment.repository.UserSubmissionRepository;
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
public class LeaderboardService {

    @Autowired
    private UserSubmissionRepository userSubmissionRepository;

    public Map<String, Object> getGlobalLeaderboard(int page, int size, Period period, Long subjectId) {
        // Simplified leaderboard implementation
        // In a real implementation, you would have more sophisticated scoring and user data
        
        List<Map<String, Object>> leaderboard = generateMockLeaderboard(page, size);
        
        Map<String, Object> result = new HashMap<>();
        result.put("leaderboard", leaderboard);
        result.put("totalUsers", 1000); // Mock total
        result.put("period", period != null ? period.toString() : "ALL_TIME");
        
        // Add current user rank if authenticated
        SecurityUtils.getCurrentUserId().ifPresent(userId -> {
            result.put("userRank", calculateUserRank(userId));
        });
        
        return result;
    }

    public Map<String, Object> getSubjectLeaderboard(Long subjectId, int page, int size, Period period) {
        List<Map<String, Object>> leaderboard = generateMockLeaderboard(page, size);
        
        Map<String, Object> result = new HashMap<>();
        result.put("leaderboard", leaderboard);
        result.put("totalUsers", 500); // Mock total
        result.put("subject", getSubjectInfo(subjectId));
        
        // Add current user rank if authenticated
        SecurityUtils.getCurrentUserId().ifPresent(userId -> {
            result.put("userRank", calculateUserRank(userId));
        });
        
        return result;
    }

    public Map<String, Object> getClassLeaderboard(ClassLevel classLevel, int page, int size, 
                                                  Period period, Long subjectId) {
        List<Map<String, Object>> leaderboard = generateMockLeaderboard(page, size);
        
        Map<String, Object> result = new HashMap<>();
        result.put("leaderboard", leaderboard);
        result.put("totalUsers", 200); // Mock total
        result.put("classLevel", classLevel);
        
        // Add current user rank if authenticated
        SecurityUtils.getCurrentUserId().ifPresent(userId -> {
            result.put("userRank", calculateUserRank(userId));
        });
        
        return result;
    }

    private List<Map<String, Object>> generateMockLeaderboard(int page, int size) {
        // Mock leaderboard data - in real implementation, query from database
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        
        for (int i = 0; i < size; i++) {
            int rank = page * size + i + 1;
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", rank);
            entry.put("user", createMockUser(rank));
            entry.put("score", Math.max(1000 - rank * 10, 100));
            entry.put("accuracy", Math.max(95.0 - rank * 0.5, 60.0));
            entry.put("problemsSolved", Math.max(100 - rank, 10));
            entry.put("streak", Math.max(30 - rank, 0));
            entry.put("badges", createMockBadges(rank));
            leaderboard.add(entry);
        }
        
        return leaderboard;
    }

    private Map<String, Object> createMockUser(int rank) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", (long) rank);
        user.put("username", "User" + rank);
        user.put("displayName", "Student " + rank);
        user.put("avatar", "https://example.com/avatar" + rank + ".jpg");
        return user;
    }

    private List<String> createMockBadges(int rank) {
        List<String> badges = new ArrayList<>();
        if (rank <= 10) badges.add("Top 10");
        if (rank <= 3) badges.add("Podium Finisher");
        if (rank == 1) badges.add("Champion");
        return badges;
    }

    private Integer calculateUserRank(Long userId) {
        // Mock rank calculation
        return (int) (userId % 100) + 1;
    }

    private Map<String, Object> getSubjectInfo(Long subjectId) {
        // Mock subject info
        Map<String, Object> subject = new HashMap<>();
        subject.put("id", subjectId);
        subject.put("name", "Subject " + subjectId);
        return subject;
    }
}