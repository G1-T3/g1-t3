package com.project.G1_T3.playerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.G1_T3.playerprofile.model.PlayerProfile;
import com.project.G1_T3.user.model.User;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlayerProfileRepository extends JpaRepository<PlayerProfile, UUID> {

    List<PlayerProfile> findTop10ByOrderByGlickoRatingDesc();

    List<PlayerProfile> findAllByOrderByCurrentRatingDesc();

    PlayerProfile findByUser(User user);

    // Fetch PlayerProfile by user ID
    PlayerProfile findByUserId(UUID id);

    @Query("SELECT p.glickoRating, COUNT(p) FROM PlayerProfile p GROUP BY p.glickoRating")
    List<Object[]> getRatingCounts();

    PlayerProfile findByProfileId(UUID profileId);

    @Query(value = "select t1.position\n" + //
            "from player_profiles pp1,\n" + //
            "(select \n" + //
            "row_number() over (order by pp2.glicko_rating desc) as position,\n" + //
            "pp2.user_id uid, pp2.glicko_rating \n" + //
            "from player_profiles pp2\n" + //
            "order by glicko_rating desc) as t1\n" + //
            "where t1.uid = pp1.user_id and t1.uid = :userId", nativeQuery = true)
    public Long getPositionOfPlayer(@Param("userId") UUID userId);
}
