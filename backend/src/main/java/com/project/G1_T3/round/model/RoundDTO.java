package com.project.G1_T3.round.model;

import com.project.G1_T3.common.model.Status;
import com.project.G1_T3.match.model.Match;
import com.project.G1_T3.playerprofile.model.PlayerProfile;
import com.project.G1_T3.stage.model.Format;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class RoundDTO {

    private UUID roundId;
    private UUID stageId;  // Assuming you only want the stage ID here
    private Integer roundNumber;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Status status;
    private Format format;
    private List<Match> matches;
    private Set<PlayerProfile> players;
}
