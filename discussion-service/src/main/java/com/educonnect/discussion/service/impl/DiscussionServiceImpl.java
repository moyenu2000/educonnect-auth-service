package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.DiscussionDto;
import com.educonnect.discussion.dto.DiscussionRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Answer;
import com.educonnect.discussion.entity.Discussion;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.entity.Vote;
import com.educonnect.discussion.entity.Bookmark;
import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.DiscussionStatus;
import com.educonnect.discussion.enums.DiscussionType;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.exception.UnauthorizedException;
import com.educonnect.discussion.repository.*;
import com.educonnect.discussion.service.DiscussionService;
import com.educonnect.discussion.service.UserSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiscussionServiceImpl implements DiscussionService {

    @Autowired
    private DiscussionRepository discussionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserSyncService userSyncService;

    @Override
    public PagedResponse<DiscussionDto> getDiscussions(
            DiscussionType type,
            Long subjectId,
            Long topicId,
            ClassLevel classLevel,
            String sortBy,
            Pageable pageable,
            Long currentUserId) {
        
        Sort sort = createSort(sortBy);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        
        Page<Discussion> discussionsPage = discussionRepository.findDiscussionsWithFilters(
            DiscussionStatus.ACTIVE, type, subjectId, topicId, classLevel, null, sortedPageable);
        
        List<DiscussionDto> discussionDtos = discussionsPage.getContent().stream()
            .map(discussion -> enrichDiscussionDto(discussion, currentUserId))
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            discussionDtos,
            (int) discussionsPage.getTotalElements(),
            discussionsPage.getTotalPages(),
            discussionsPage.getNumber(),
            discussionsPage.getSize(),
            discussionsPage.isFirst(),
            discussionsPage.isLast(),
            discussionsPage.isEmpty()
        );
    }

    @Override
    public DiscussionDto getDiscussionById(Long id, Long currentUserId) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        
        if (discussion.getStatus() == DiscussionStatus.HIDDEN) {
            throw new ResourceNotFoundException("Discussion not found with id: " + id);
        }
        
        discussionRepository.incrementViewsCount(id);
        
        return enrichDiscussionDto(discussion, currentUserId);
    }

    @Override
    public DiscussionDto createDiscussion(DiscussionRequest request, Long authorId) {
        User author = userSyncService.getOrCreateUser(authorId);
        
        Discussion discussion = new Discussion();
        discussion.setTitle(request.getTitle());
        discussion.setContent(request.getContent());
        discussion.setType(request.getType());
        discussion.setAuthor(author);
        discussion.setSubjectId(request.getSubjectId());
        discussion.setTopicId(request.getTopicId());
        discussion.setClassLevel(request.getClassLevel());
        discussion.setTags(request.getTags());
        discussion.setAttachments(request.getAttachments());
        discussion.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        
        Discussion savedDiscussion = discussionRepository.save(discussion);
        return DiscussionDto.fromEntity(savedDiscussion);
    }

    @Override
    public DiscussionDto updateDiscussion(Long id, DiscussionRequest request, Long currentUserId) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        
        if (!discussion.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only update your own discussions");
        }
        
        discussion.setTitle(request.getTitle());
        discussion.setContent(request.getContent());
        discussion.setTags(request.getTags());
        discussion.setAttachments(request.getAttachments());
        
        Discussion savedDiscussion = discussionRepository.save(discussion);
        return enrichDiscussionDto(savedDiscussion, currentUserId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteDiscussion(Long id, Long currentUserId) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        
        if (!discussion.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only delete your own discussions");
        }
        
        // Delete related entities to avoid foreign key constraint violations
        // Use a simple approach with native queries for better control
        
        // Get answer IDs first to delete their votes
        List<Long> answerIds = answerRepository.findAnswerIdsByDiscussionId(id);
        
        // Delete votes for answers first
        for (Long answerId : answerIds) {
            voteRepository.deleteByAnswerId(answerId);
        }
        
        // Delete votes for this discussion
        voteRepository.deleteByDiscussionId(id);
        
        // Delete bookmarks for this discussion
        bookmarkRepository.deleteByDiscussionId(id);
        
        // Delete answers for this discussion
        answerRepository.deleteByDiscussionId(id);
        
        // Now safe to delete the discussion by ID
        discussionRepository.deleteById(id);
    }

    @Override
    public PagedResponse<DiscussionDto> searchDiscussions(
            String query,
            Long subjectId,
            DiscussionType type,
            String sortBy,
            Pageable pageable,
            Long currentUserId) {
        
        Sort sort = createSort(sortBy);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        
        Page<Discussion> discussionsPage = discussionRepository.searchDiscussions(
            query, subjectId, type, sortedPageable);
        
        List<DiscussionDto> discussionDtos = discussionsPage.getContent().stream()
            .map(discussion -> enrichDiscussionDto(discussion, currentUserId))
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            discussionDtos,
            (int) discussionsPage.getTotalElements(),
            discussionsPage.getTotalPages(),
            discussionsPage.getNumber(),
            discussionsPage.getSize(),
            discussionsPage.isFirst(),
            discussionsPage.isLast(),
            discussionsPage.isEmpty()
        );
    }

    @Override
    public void upvoteDiscussion(Long id, Long userId) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        
        User user = userSyncService.getOrCreateUser(userId);
        
        Vote existingVote = voteRepository.findByUserIdAndDiscussionId(userId, id).orElse(null);
        
        if (existingVote != null) {
            if (existingVote.getIsUpvote()) {
                voteRepository.delete(existingVote);
                discussion.setUpvotesCount(discussion.getUpvotesCount() - 1);
            } else {
                existingVote.setIsUpvote(true);
                voteRepository.save(existingVote);
                discussion.setUpvotesCount(discussion.getUpvotesCount() + 1);
                discussion.setDownvotesCount(discussion.getDownvotesCount() - 1);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(user);
            vote.setDiscussion(discussion);
            vote.setIsUpvote(true);
            voteRepository.save(vote);
            discussion.setUpvotesCount(discussion.getUpvotesCount() + 1);
        }
        
        discussionRepository.save(discussion);
    }

    @Override
    public void downvoteDiscussion(Long id, Long userId) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        
        User user = userSyncService.getOrCreateUser(userId);
        
        Vote existingVote = voteRepository.findByUserIdAndDiscussionId(userId, id).orElse(null);
        
        if (existingVote != null) {
            if (!existingVote.getIsUpvote()) {
                voteRepository.delete(existingVote);
                discussion.setDownvotesCount(discussion.getDownvotesCount() - 1);
            } else {
                existingVote.setIsUpvote(false);
                voteRepository.save(existingVote);
                discussion.setDownvotesCount(discussion.getDownvotesCount() + 1);
                discussion.setUpvotesCount(discussion.getUpvotesCount() - 1);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(user);
            vote.setDiscussion(discussion);
            vote.setIsUpvote(false);
            voteRepository.save(vote);
            discussion.setDownvotesCount(discussion.getDownvotesCount() + 1);
        }
        
        discussionRepository.save(discussion);
    }

    @Override
    public void bookmarkDiscussion(Long id, Long userId) {
        Discussion discussion = discussionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + id));
        
        User user = userSyncService.getOrCreateUser(userId);
        
        Bookmark existingBookmark = bookmarkRepository.findByUserIdAndDiscussionId(userId, id).orElse(null);
        
        if (existingBookmark != null) {
            bookmarkRepository.delete(existingBookmark);
        } else {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setDiscussion(discussion);
            bookmarkRepository.save(bookmark);
        }
    }

    @Override
    public PagedResponse<DiscussionDto> getGroupDiscussions(Long groupId, String sortBy, Pageable pageable, Long currentUserId) {
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, currentUserId)) {
            throw new UnauthorizedException("You must be a member of this group to view discussions");
        }
        
        Sort sort = createSort(sortBy);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        
        Page<Discussion> discussionsPage = discussionRepository.findByGroupId(groupId, sortedPageable);
        
        List<DiscussionDto> discussionDtos = discussionsPage.getContent().stream()
            .map(discussion -> enrichDiscussionDto(discussion, currentUserId))
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            discussionDtos,
            (int) discussionsPage.getTotalElements(),
            discussionsPage.getTotalPages(),
            discussionsPage.getNumber(),
            discussionsPage.getSize(),
            discussionsPage.isFirst(),
            discussionsPage.isLast(),
            discussionsPage.isEmpty()
        );
    }

    @Override
    public DiscussionDto createGroupDiscussion(Long groupId, DiscussionRequest request, Long authorId) {
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, authorId)) {
            throw new UnauthorizedException("You must be a member of this group to create discussions");
        }
        
        User author = userSyncService.getOrCreateUser(authorId);
        
        Discussion discussion = new Discussion();
        discussion.setTitle(request.getTitle());
        discussion.setContent(request.getContent());
        discussion.setType(DiscussionType.GENERAL); // Group discussions are general type
        discussion.setAuthor(author);
        discussion.setGroupId(groupId);
        discussion.setTags(request.getTags());
        discussion.setAttachments(request.getAttachments());
        discussion.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        
        Discussion savedDiscussion = discussionRepository.save(discussion);
        return DiscussionDto.fromEntity(savedDiscussion);
    }

    private DiscussionDto enrichDiscussionDto(Discussion discussion, Long currentUserId) {
        DiscussionDto dto = DiscussionDto.fromEntity(discussion);
        
        if (currentUserId != null) {
            Vote userVote = voteRepository.findByUserIdAndDiscussionId(currentUserId, discussion.getId()).orElse(null);
            if (userVote != null) {
                dto.setUpvoted(userVote.getIsUpvote());
                dto.setDownvoted(!userVote.getIsUpvote());
            }
            
            boolean isBookmarked = bookmarkRepository.existsByUserIdAndDiscussionId(currentUserId, discussion.getId());
            dto.setBookmarked(isBookmarked);
        }
        
        return dto;
    }

    private Sort createSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        
        return switch (sortBy.toUpperCase()) {
            case "NEWEST" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "OLDEST" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "MOST_UPVOTED" -> Sort.by(Sort.Direction.DESC, "upvotesCount");
            case "MOST_ANSWERED" -> Sort.by(Sort.Direction.DESC, "answersCount");
            case "MOST_VIEWED" -> Sort.by(Sort.Direction.DESC, "viewsCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}