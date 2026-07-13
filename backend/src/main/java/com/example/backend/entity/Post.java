package com.example.backend.entity;

import com.example.backend.entity.workoutEntities.Workout;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;
    private String username;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "workout_id",
            nullable = false
    )
    private Workout workout;

    @Column(nullable = false)
    private String caption;


    private String photoUrl;

    @OneToMany(
            mappedBy = "post",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Comment> comments = new ArrayList<>();
}