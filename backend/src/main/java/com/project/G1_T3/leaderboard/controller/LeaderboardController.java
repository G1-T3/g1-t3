package com.project.G1_T3.leaderboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.project.G1_T3.leaderboard.service.LeaderboardService;

import com.project.G1_T3.leaderboard.model.LeaderboardPlayerProfile;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    // Fetch the current leaderboard
    @GetMapping
    public List<LeaderboardPlayerProfile> getLeaderboard() {
        return leaderboardService.getTop10LeaderboardPlayerProfiles();
    }

    // Submit a new score for a player
    // @PostMapping
    // public ResponseEntity<String> submitScore(@RequestBody Score score) {
    // leaderboardService.submitScore(score);
    // return ResponseEntity.ok("Score submitted");
    // }

    // Get a specific player's position and info
 
    @GetMapping("user/{userId}") 
    public LeaderboardPlayerProfile getPlayerInfoById(@PathVariable String userId) { 
        return leaderboardService.getPlayerInfoById(userId); 
    }

    @GetMapping("user")
    public LeaderboardPlayerProfile getPlayerInfo(@RequestParam String username) {
        return leaderboardService.getPlayerInfo(username);
    }
}
