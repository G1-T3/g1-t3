package com.project.G1_T3.match.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.G1_T3.common.model.Status;
import com.project.G1_T3.round.model.Round;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "match")
public class Match {
    @Id
    @GeneratedValue()
    private UUID matchId;

    @ManyToOne
    @JoinColumn(name = "round_id", nullable = true)
    @JsonIgnore
    private Round round;

    @Column(nullable = false)
    private UUID player1Id;

    @Column(nullable = true)
    private UUID player2Id;

    @Column(name = "scheduled_time", columnDefinition = "TIMESTAMP")
    private LocalDateTime scheduledTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private Status status;

    @Column
    private UUID winnerId;

    @Column(length = 50)
    private String score = "0-0";

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private GameType gameType;

    @Column(name = "meeting_latitude", nullable = true)
    private Double meetingLatitude;

    @Column(name = "meeting_longitude", nullable = true)
    private Double meetingLongitude;

    public enum GameType {
        SOLO, TOURNAMENT
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void startMatch() {
        if (this.status == Status.SCHEDULED) {
            this.status = Status.IN_PROGRESS;
            this.updatedAt = LocalDateTime.now();
        }
    }

    public void completeMatch(UUID winnerId, String score) {
        if (this.status != Status.COMPLETED || this.status != Status.CANCELLED) {
            this.winnerId = winnerId;
            this.score = score;
            this.status = Status.COMPLETED;
            this.updatedAt = LocalDateTime.now();
        }
    }

    // Additional getters and setters
    public UUID getId() {
        return this.matchId;
    }

    public void setId(UUID matchId) {
        this.matchId = matchId;
    }

    public void setGameType(GameType gameType) {
        this.gameType = gameType;
    }

    public void setPlayer1Id(UUID player1Id) {
        this.player1Id = player1Id;
    }

    public UUID getPlayer1Id() {
        return player1Id;
    }

    public UUID getPlayer2Id() {
        return player2Id;
    }

    public void setPlayer2Id(UUID player2Id) {
        this.player2Id = player2Id;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public GameType getGameType() {
        return gameType;
    }

    public Status getStatus() {
        return status;
    }

    public void setMeetingLatitude(Double meetingLatitude) {
        this.meetingLatitude = meetingLatitude;
    }

    public void setMeetingLongitude(Double meetingLongitude) {
        this.meetingLongitude = meetingLongitude;
    }
}
