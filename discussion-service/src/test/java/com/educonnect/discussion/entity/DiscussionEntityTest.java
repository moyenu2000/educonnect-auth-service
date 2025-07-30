package com.educonnect.discussion.entity;

import com.educonnect.discussion.enums.DiscussionType;
import com.educonnect.discussion.enums.DiscussionStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Simple entity tests for Discussion
 */
public class DiscussionEntityTest {

    @Test
    public void testDiscussionCreation() {
        Discussion discussion = new Discussion();
        
        // Test basic setters and getters
        discussion.setTitle("Test Discussion");
        discussion.setContent("This is a test discussion content");
        discussion.setType(DiscussionType.GENERAL);
        discussion.setUpvotesCount(0);
        discussion.setDownvotesCount(0);
        discussion.setViewsCount(0);
        discussion.setAnswersCount(0);
        discussion.setIsAnonymous(false);
        discussion.setStatus(DiscussionStatus.ACTIVE);
        
        assertEquals("Test Discussion", discussion.getTitle());
        assertEquals("This is a test discussion content", discussion.getContent());
        assertEquals(DiscussionType.GENERAL, discussion.getType());
        assertEquals(0, discussion.getUpvotesCount());
        assertEquals(0, discussion.getDownvotesCount());
        assertEquals(0, discussion.getViewsCount());
        assertEquals(0, discussion.getAnswersCount());
        assertEquals(false, discussion.getIsAnonymous());
        assertEquals(DiscussionStatus.ACTIVE, discussion.getStatus());
    }

    @Test
    public void testDiscussionDefaultValues() {
        Discussion discussion = new Discussion();
        
        // Test default values
        assertEquals(0, discussion.getUpvotesCount());
        assertEquals(0, discussion.getDownvotesCount());
        assertEquals(0, discussion.getAnswersCount());
        assertEquals(0, discussion.getViewsCount());
        assertEquals(false, discussion.getHasAcceptedAnswer());
        assertEquals(false, discussion.getIsAnonymous());
        assertEquals(DiscussionStatus.ACTIVE, discussion.getStatus());
        
        // Test tags and attachments are initialized
        assertNotNull(discussion.getTags());
        assertNotNull(discussion.getAttachments());
        assertTrue(discussion.getTags().isEmpty());
        assertTrue(discussion.getAttachments().isEmpty());
    }

    @Test
    public void testDiscussionEnums() {
        // Test DiscussionType enum values
        DiscussionType[] types = DiscussionType.values();
        assertTrue(types.length > 0);
        
        // Test DiscussionStatus enum values  
        DiscussionStatus[] statuses = DiscussionStatus.values();
        assertTrue(statuses.length > 0);
        
        // Test specific enum values exist
        assertEquals("GENERAL", DiscussionType.GENERAL.name());
        assertEquals("ACTIVE", DiscussionStatus.ACTIVE.name());
    }
}