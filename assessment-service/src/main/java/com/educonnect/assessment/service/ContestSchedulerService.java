package com.educonnect.assessment.service;

import com.educonnect.assessment.entity.Contest;
import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.repository.ContestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ContestSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(ContestSchedulerService.class);

    @Autowired
    private ContestRepository contestRepository;

    @Autowired
    private ContestService contestService;

    /**
     * Check for contests that need to be started
     * Runs every minute
     */
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void checkAndStartContests() {
        try {
            LocalDateTime now = LocalDateTime.now();
            
            // Find upcoming contests that should be started
            List<Contest> contestsToStart = contestRepository.findByStatusAndStartTimeBefore(
                ContestStatus.UPCOMING, now);
            
            for (Contest contest : contestsToStart) {
                logger.info("Auto-starting contest: {} (ID: {})", contest.getTitle(), contest.getId());
                contestService.startContest(contest.getId());
            }
            
            if (!contestsToStart.isEmpty()) {
                logger.info("Auto-started {} contest(s)", contestsToStart.size());
            }
            
        } catch (Exception e) {
            logger.error("Error in contest auto-start scheduler", e);
        }
    }

    /**
     * Check for contests that need to be ended and finalized
     * Runs every minute
     */
    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void checkAndEndContests() {
        try {
            LocalDateTime now = LocalDateTime.now();
            
            // Find active contests that should be ended
            List<Contest> contestsToEnd = contestRepository.findByStatusAndEndTimeBefore(
                ContestStatus.ACTIVE, now);
            
            for (Contest contest : contestsToEnd) {
                logger.info("Auto-ending contest: {} (ID: {})", contest.getTitle(), contest.getId());
                
                // End the contest
                contestService.endContest(contest.getId());
                
                // Finalize all submissions (calculate marks and results)
                logger.info("Finalizing submissions for contest: {} (ID: {})", contest.getTitle(), contest.getId());
                contestService.finalizeContestSubmissions(contest.getId());
                
                logger.info("Contest {} (ID: {}) has been ended and finalized", contest.getTitle(), contest.getId());
            }
            
            if (!contestsToEnd.isEmpty()) {
                logger.info("Auto-ended and finalized {} contest(s)", contestsToEnd.size());
            }
            
        } catch (Exception e) {
            logger.error("Error in contest auto-end scheduler", e);
        }
    }

    /**
     * Clean up old contest data (optional)
     * Runs daily at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
    public void cleanupOldContests() {
        try {
            // Optional: Clean up very old contests (e.g., older than 1 year)
            LocalDateTime cutoffDate = LocalDateTime.now().minusYears(1);
            
            List<Contest> oldContests = contestRepository.findByStatusAndEndTimeBefore(
                ContestStatus.COMPLETED, cutoffDate);
            
            if (!oldContests.isEmpty()) {
                logger.info("Found {} old contests for potential cleanup", oldContests.size());
                // Implementation depends on business requirements
                // You might want to archive rather than delete
            }
            
        } catch (Exception e) {
            logger.error("Error in contest cleanup scheduler", e);
        }
    }
}