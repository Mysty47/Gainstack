package com.example.backend.service;

import com.example.backend.dto.postDTOs.LikeResponseDTO;
import com.example.backend.entity.Like;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.repository.LikeRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LikeResponseDTO toggleLike(long postId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        boolean alreadyLiked = likeRepository.existsByPost_IdAndUser_Id(postId, user.getId());

        if (alreadyLiked) {
            log.info("its already liked");
            likeRepository.deleteByPost_IdAndUser_Id(postId, user.getId());
        } else {
            log.info("its not already liked");
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));

            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
        }

        long count = likeRepository.countByPost_Id(postId);
        return new LikeResponseDTO(!alreadyLiked, count);
    }

    public LikeResponseDTO getLikeStatus(long postId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        boolean liked = likeRepository.existsByPost_IdAndUser_Id(postId, user.getId());
        long count = likeRepository.countByPost_Id(postId);
        return new LikeResponseDTO(liked, count); //count - how many likes the post has
    }
}