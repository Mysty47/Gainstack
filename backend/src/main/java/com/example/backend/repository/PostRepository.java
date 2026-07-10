package com.example.backend.repository;

import com.example.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository
        extends JpaRepository<Post, Long> {
    @Query("""
        SELECT p FROM Post p
        JOIN Like l ON l.post = p
        WHERE l.user.id = :userId
        ORDER BY l.id DESC
        """)
    List<Post> findLikedPostsByUserId(@Param("userId") Long userId);
}