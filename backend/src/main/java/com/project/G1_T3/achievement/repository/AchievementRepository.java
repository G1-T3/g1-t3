package com.project.G1_T3.achievement.repository;

import com.project.G1_T3.achievement.model.Achievement;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

}