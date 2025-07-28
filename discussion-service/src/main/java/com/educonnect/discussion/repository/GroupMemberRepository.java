package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.GroupMember;
import com.educonnect.discussion.enums.GroupRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    
    @Query("SELECT gm FROM GroupMember gm LEFT JOIN FETCH gm.user LEFT JOIN FETCH gm.group WHERE gm.group.id = :groupId AND gm.user.id = :userId")
    Optional<GroupMember> findByGroupIdAndUserId(@Param("groupId") Long groupId, @Param("userId") Long userId);
    
    Page<GroupMember> findByGroupId(Long groupId, Pageable pageable);
    
    Page<GroupMember> findByGroupIdAndRole(Long groupId, GroupRole role, Pageable pageable);
    
    Page<GroupMember> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT gm FROM GroupMember gm LEFT JOIN FETCH gm.user LEFT JOIN FETCH gm.group WHERE gm.group.id = :groupId AND " +
           "(:role IS NULL OR gm.role = :role)")
    Page<GroupMember> findMembersWithFilters(
        @Param("groupId") Long groupId,
        @Param("role") GroupRole role,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(gm) FROM GroupMember gm WHERE gm.group.id = :groupId")
    Long countByGroupId(@Param("groupId") Long groupId);
    
    @Query("SELECT COUNT(gm) FROM GroupMember gm WHERE gm.group.id = :groupId AND gm.role = :role")
    Long countByGroupIdAndRole(@Param("groupId") Long groupId, @Param("role") GroupRole role);
    
    boolean existsByGroupIdAndUserId(Long groupId, Long userId);
    
    void deleteByGroupIdAndUserId(Long groupId, Long userId);
}