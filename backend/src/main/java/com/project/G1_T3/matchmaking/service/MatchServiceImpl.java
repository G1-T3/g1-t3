package com.project.G1_T3.matchmaking.service;

import java.util.UUID;
import com.project.G1_T3.common.model.Status;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.G1_T3.match.model.Match;
import com.project.G1_T3.match.repository.MatchRepository;
import com.project.G1_T3.player.model.PlayerProfile;
import com.project.G1_T3.player.repository.PlayerProfileRepository;

@Service
public class MatchServiceImpl implements MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private PlayerProfileRepository playerProfileRepository;

    @Override
    public Match getCurrentMatchForUser(UUID userId) {
        PlayerProfile playerProfile = playerProfileRepository.findByUserId(userId);
        if (playerProfile == null) {
            return null;
        }

        return matchRepository.findByPlayer1IdOrPlayer2IdAndStatus(
                playerProfile.getProfileId(),
                playerProfile.getProfileId(),
                Status.IN_PROGRESS);
    }
}