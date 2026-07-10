package com.example.backend.dto.postDTOs;

public class LikeResponseDTO {
    private boolean liked;
    private long likeCount;

    public LikeResponseDTO(boolean liked, long likeCount) {
        this.liked = liked;
        this.likeCount = likeCount;
    }

    public boolean isLiked() { return liked; }
    public long getLikeCount() { return likeCount; }
}