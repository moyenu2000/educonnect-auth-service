package com.educonnect.assessment.service;

import com.educonnect.assessment.dto.PagedResponse;
import com.educonnect.assessment.dto.SubjectRequest;
import com.educonnect.assessment.entity.Subject;
import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.exception.ResourceNotFoundException;
import com.educonnect.assessment.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public PagedResponse<Subject> getAllSubjects(int page, int size, ClassLevel classLevel, boolean includeInactive) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayOrder", "name"));
        Page<Subject> subjects;

        if (includeInactive) {
            if (classLevel != null) {
                subjects = subjectRepository.findByClassLevel(classLevel, pageable);
            } else {
                subjects = subjectRepository.findAll(pageable);
            }
        } else {
            subjects = subjectRepository.findFilteredSubjects(classLevel, pageable);
        }

        return new PagedResponse<>(
                subjects.getContent(),
                (int) subjects.getTotalElements(),
                subjects.getTotalPages(),
                subjects.getNumber(),
                subjects.getSize()
        );
    }

    public List<Subject> getPublicSubjects(ClassLevel classLevel) {
        if (classLevel != null) {
            return subjectRepository.findByClassLevelAndIsActiveTrueOrderByDisplayOrder(classLevel);
        }
        return subjectRepository.findByIsActiveTrueOrderByDisplayOrder();
    }

    @Transactional(readOnly = true)
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Subject getActiveSubjectById(Long id) {
        return subjectRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Active subject not found with id: " + id));
    }

    public Subject createSubject(SubjectRequest request) {
        if (subjectRepository.existsByNameAndClassLevel(request.getName(), request.getClassLevel())) {
            throw new IllegalArgumentException("Subject with this name already exists for this class level");
        }

        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setClassLevel(request.getClassLevel());
        subject.setDisplayOrder(request.getDisplayOrder());
        subject.setIsActive(request.getIsActive());

        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Long id, SubjectRequest request) {
        Subject subject = getSubjectById(id);

        if (!subject.getName().equals(request.getName()) &&
            subjectRepository.existsByNameAndClassLevelAndIdNot(request.getName(), request.getClassLevel(), id)) {
            throw new IllegalArgumentException("Subject with this name already exists for this class level");
        }

        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setClassLevel(request.getClassLevel());
        subject.setDisplayOrder(request.getDisplayOrder());
        subject.setIsActive(request.getIsActive());

        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long id) {
        Subject subject = getSubjectById(id);
        subjectRepository.delete(subject);
    }

    public void deactivateSubject(Long id) {
        Subject subject = getSubjectById(id);
        subject.setIsActive(false);
        subjectRepository.save(subject);
    }
}