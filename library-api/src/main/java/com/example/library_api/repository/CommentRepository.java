package com.example.library_api.repository;

import com.example.library_api.dto.CommentsDTO;
import com.example.library_api.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Query("SELECT new com.example.library_api.dto.CommentsDTO(c.id, c.bookCode, c.profileCode, p.firstName, p.lastName, c.commentText, p.image, c.createAt) " +
            "FROM CommentEntity c JOIN ProfileEntity p ON c.profileCode = p.profileCode " +
            "WHERE c.bookCode = :bookCode AND c.isDelete = 0")
    Page<CommentsDTO> findCommentsWithProfileByBookCode(@Param("bookCode") String bookCode, Pageable pageable);

}
