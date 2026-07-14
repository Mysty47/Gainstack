package com.example.backend.repository;

import com.example.backend.entity.Like;
import com.example.backend.entity.Post;
import com.example.backend.entity.workoutEntities.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPost_IdAndUser_Id(long postId, long userId);
    boolean existsByPost_IdAndUser_Id(long postId, long userId);
    long countByPost_Id(long postId);
    void deleteByPost_IdAndUser_Id(long postId, long userId);
    void deleteAllByPost(Post post);
}
