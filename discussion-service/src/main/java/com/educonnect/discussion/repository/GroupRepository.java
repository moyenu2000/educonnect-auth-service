package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.Group;
import com.educonnect.discussion.enums.GroupType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    
    Page<Group> findByIsPrivate(Boolean isPrivate, Pageable pageable);
    
    Page<Group> findByType(GroupType type, Pageable pageable);
    
    Page<Group> findBySubjectId(Long subjectId, Pageable pageable);
    
    @Query("SELECT g FROM Group g WHERE " +
           "(:type IS NULL OR g.type = :type) AND " +
           "(:subjectId IS NULL OR g.subjectId = :subjectId) AND " +
           "(:isPrivate IS NULL OR g.isPrivate = :isPrivate)")
    Page<Group> findGroupsWithFilters(
        @Param("type") GroupType type,
        @Param("subjectId") Long subjectId,
        @Param("isPrivate") Boolean isPrivate,
        Pageable pageable
    );
    
    @Query("SELECT g FROM Group g WHERE " +
           "(g.name LIKE %:query% OR g.description LIKE %:query%) AND " +
           "(:type IS NULL OR g.type = :type)")
    Page<Group> searchGroups(
        @Param("query") String query,
        @Param("type") GroupType type,
        Pageable pageable
    );
    
    @Query("SELECT g FROM Group g JOIN GroupMember gm ON g.id = gm.group.id " +
           "WHERE gm.user.id = :userId")
    Page<Group> findGroupsByMemberId(@Param("userId") Long userId, Pageable pageable);
    
    @Modifying
    @Query("UPDATE Group g SET g.membersCount = g.membersCount + 1 WHERE g.id = :id")
    void incrementMembersCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Group g SET g.membersCount = g.membersCount - 1 WHERE g.id = :id AND g.membersCount > 0")
    void decrementMembersCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Group g SET g.discussionsCount = g.discussionsCount + 1 WHERE g.id = :id")
    void incrementDiscussionsCount(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Group g SET g.discussionsCount = g.discussionsCount - 1 WHERE g.id = :id AND g.discussionsCount > 0")
    void decrementDiscussionsCount(@Param("id") Long id);
}