package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.AnswerDto;
import com.educonnect.discussion.dto.AnswerRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Answer;
import com.educonnect.discussion.entity.Discussion;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.entity.Vote;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.exception.UnauthorizedException;
import com.educonnect.discussion.repository.*;
import com.educonnect.discussion.service.AnswerService;
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
public class AnswerServiceImpl implements AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private DiscussionRepository discussionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserSyncService userSyncService;

    @Override
    public PagedResponse<AnswerDto> getAnswersByDiscussionId(Long discussionId, String sortBy, Pageable pageable, Long currentUserId) {
        Discussion discussion = discussionRepository.findById(discussionId)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + discussionId));
        
        Sort sort = createSort(sortBy);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        
        Page<Answer> answersPage = answerRepository.findByDiscussionId(discussionId, sortedPageable);
        
        List<AnswerDto> answerDtos = answersPage.getContent().stream()
            .map(AnswerDto::fromEntity)
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            answerDtos,
            (int) answersPage.getTotalElements(),
            answersPage.getTotalPages(),
            answersPage.getNumber(),
            answersPage.getSize(),
            answersPage.isFirst(),
            answersPage.isLast(),
            answersPage.isEmpty()
        );
    }

    @Override
    public AnswerDto createAnswer(Long discussionId, AnswerRequest request, Long authorId) {
        Discussion discussion = discussionRepository.findById(discussionId)
            .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + discussionId));
        
        User author = userSyncService.getOrCreateUser(authorId);
        
        Answer answer = new Answer();
        answer.setContent(request.getContent());
        answer.setAuthor(author);
        answer.setDiscussion(discussion);
        answer.setAttachments(request.getAttachments());
        answer.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        
        Answer savedAnswer = answerRepository.save(answer);
        
        // Increment answers count for discussion
        discussionRepository.incrementAnswersCount(discussionId);
        
        return AnswerDto.fromEntity(savedAnswer);
    }

    @Override
    public AnswerDto updateAnswer(Long answerId, AnswerRequest request, Long currentUserId) {
        Answer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        if (!answer.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only update your own answers");
        }
        
        answer.setContent(request.getContent());
        answer.setAttachments(request.getAttachments());
        
        Answer savedAnswer = answerRepository.save(answer);
        return AnswerDto.fromEntity(savedAnswer);
    }

    @Override
    public void deleteAnswer(Long answerId, Long currentUserId) {
        Answer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        if (!answer.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only delete your own answers");
        }
        
        Long discussionId = answer.getDiscussion().getId();
        answerRepository.delete(answer);
        
        // Decrement answers count for discussion
        discussionRepository.decrementAnswersCount(discussionId);
    }

    @Override
    public void upvoteAnswer(Long answerId, Long userId) {
        Answer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        User user = userSyncService.getOrCreateUser(userId);
        
        Vote existingVote = voteRepository.findByUserIdAndAnswerId(userId, answerId).orElse(null);
        
        if (existingVote != null) {
            if (existingVote.getIsUpvote()) {
                voteRepository.delete(existingVote);
                answer.setUpvotesCount(answer.getUpvotesCount() - 1);
            } else {
                existingVote.setIsUpvote(true);
                voteRepository.save(existingVote);
                answer.setUpvotesCount(answer.getUpvotesCount() + 1);
                answer.setDownvotesCount(answer.getDownvotesCount() - 1);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(user);
            vote.setAnswer(answer);
            vote.setIsUpvote(true);
            voteRepository.save(vote);
            answer.setUpvotesCount(answer.getUpvotesCount() + 1);
        }
        
        answerRepository.save(answer);
    }

    @Override
    public void downvoteAnswer(Long answerId, Long userId) {
        Answer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        User user = userSyncService.getOrCreateUser(userId);
        
        Vote existingVote = voteRepository.findByUserIdAndAnswerId(userId, answerId).orElse(null);
        
        if (existingVote != null) {
            if (!existingVote.getIsUpvote()) {
                voteRepository.delete(existingVote);
                answer.setDownvotesCount(answer.getDownvotesCount() - 1);
            } else {
                existingVote.setIsUpvote(false);
                voteRepository.save(existingVote);
                answer.setDownvotesCount(answer.getDownvotesCount() + 1);
                answer.setUpvotesCount(answer.getUpvotesCount() - 1);
            }
        } else {
            Vote vote = new Vote();
            vote.setUser(user);
            vote.setAnswer(answer);
            vote.setIsUpvote(false);
            voteRepository.save(vote);
            answer.setDownvotesCount(answer.getDownvotesCount() + 1);
        }
        
        answerRepository.save(answer);
    }

    @Override
    public void acceptAnswer(Long answerId, Long currentUserId) {
        Answer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        Discussion discussion = answer.getDiscussion();
        
        // Only the discussion author can accept answers
        if (!discussion.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Only the discussion author can accept answers");
        }
        
        // Unaccept all other answers for this discussion
        answerRepository.unacceptAllAnswersForDiscussion(discussion.getId());
        
        // Accept this answer
        answer.setIsAccepted(true);
        answerRepository.save(answer);
        
        // Mark discussion as having an accepted answer
        discussion.setHasAcceptedAnswer(true);
        discussionRepository.save(discussion);
    }

    private Sort createSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        
        return switch (sortBy.toUpperCase()) {
            case "NEWEST" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "OLDEST" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "MOST_UPVOTED" -> Sort.by(Sort.Direction.DESC, "upvotesCount");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}