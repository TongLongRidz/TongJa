package com.example.library_api.service;


import com.example.library_api.dto.CommentsDTO;
import com.example.library_api.entity.BorrowingEntity;
import com.example.library_api.entity.CommentEntity;
import com.example.library_api.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;

    public Long addBookComment(CommentEntity commentEntity) {
        CommentEntity newCommentEntity = new CommentEntity();
        newCommentEntity.setBookCode(commentEntity.getBookCode());
        newCommentEntity.setProfileCode(commentEntity.getProfileCode());
        newCommentEntity.setCommentText(commentEntity.getCommentText());
        newCommentEntity.setCreateAt(LocalDateTime.now());
        newCommentEntity.setIsDelete(0);

        try {
            newCommentEntity = commentRepository.save(newCommentEntity);
            return newCommentEntity.getId();
        } catch (Exception e) {
            return null;
        }
    }


    public Page<CommentsDTO> getBookComments(String bookCode, Pageable pageable) {
        return commentRepository.findCommentsWithProfileByBookCode(bookCode, pageable);
    }

}
