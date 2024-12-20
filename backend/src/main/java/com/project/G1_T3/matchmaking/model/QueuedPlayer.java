package com.project.G1_T3.matchmaking.model;

import java.time.Instant;

import com.project.G1_T3.playerprofile.model.PlayerProfile;

public class QueuedPlayer {
    private final PlayerProfile player;
    private final double latitude;
    private final double longitude;
    private final Instant joinTime;

    public QueuedPlayer(PlayerProfile player, double latitude, double longitude) {
        this.player = player;
        this.latitude = latitude;
        this.longitude = longitude;
        this.joinTime = Instant.now();
    }

    public PlayerProfile getPlayer() {
        return player;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public Instant getJoinTime() {
        return joinTime;
    }

    public long getQueueTimeSeconds() {
        return Instant.now().getEpochSecond() - joinTime.getEpochSecond();
    }

    public double getPriority() {
        // Combining both priority calculations
        long waitTimeSeconds = getQueueTimeSeconds();
        return (waitTimeSeconds * 0.1) + player.getGlickoRating();
    }

    // getglickorating
    public double getGlickoRating() {
        return player.getGlickoRating();
    }

    // getglickord
    public double getGlickoRD() {
        return player.getCurrentRD();
    }
}
