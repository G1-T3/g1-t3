// BracketMatch.tsx
'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MatchTracker } from "@/types/matchTracker";
import { convertToMatchDTO } from "@/hooks/tournamentDataManager";
import axiosInstance from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_SPRINGBOOT_API_URL;

type MatchProps = {
  match: MatchTracker;
  onMatchComplete?: (winner: { userId: string; id: string }) => void;
  isAdmin: boolean;
};

const BracketMatch: React.FC<MatchProps> = ({ match, onMatchComplete, isAdmin }) => {
  const { player1, player2 } = match;
  const [p1Score, setP1Score] = useState(player1.score ?? 0);
  const [p2Score, setP2Score] = useState(player2?.score ?? 0);
  const [winner, setWinner] = useState<{ userId: string; id: string } | null>(match.winner ?? null);

  const incrementScore = (setScore: React.Dispatch<React.SetStateAction<number>>) => setScore((prev) => Number(prev) + 1);
  const decrementScore = (setScore: React.Dispatch<React.SetStateAction<number>>) => setScore((prev) => (prev > 0 ? prev - 1 : 0));

  // Send a PUT request to complete the match on the backend
  const completeMatchRequest = async (winnerId: string) => {
    if (!winnerId) {
      console.error("Error: winnerId is null");
      return;
    }

    const matchDTO = convertToMatchDTO({
      ...match,
      winner: { id: winnerId, userId: winnerId },
      player1: { ...player1, score: p1Score },
      player2: player2 ? { ...player2, score: p2Score } : null,
    });

    console.table(matchDTO);

    try {
      await axiosInstance.put(`${API_URL}/match/${match.matchId}/complete`, matchDTO);
      alert("Match completed successfully!");
    } catch (error) {
      console.error("Error completing the match:", error);
      alert("Failed to complete the match.");
    }
  };

  // Confirm and complete match
  const completeMatch = () => {
    if (confirm("Are you sure you want to complete this match?")) {
      if (p1Score > p2Score) {
        setWinner({ userId: player1.userId, id: player1.id });
        completeMatchRequest(player1.id);
      } else if (p2Score > p1Score && player2) {
        setWinner({ userId: player2.userId, id: player2.id });
        completeMatchRequest(player2.id);
      } else {
        alert("The match cannot end in a tie. Adjust the scores to determine a winner.");
      }
    }
  };

  // Confirm and handle forfeit
  const handleForfeit = (player: "player1" | "player2") => {
    if (confirm(`Are you sure you want to forfeit ${player === "player1" ? player1.userId : player2?.userId}?`)) {
      const forfeitWinner = player === "player1" ? player2 : player1;
      if (forfeitWinner) {
        setWinner({ userId: forfeitWinner.userId, id: forfeitWinner.id });
        if(forfeitWinner.userId === player1.userId && player2){
          player2.score = 0;
        } else {
          player1.score = 0;
        }

        completeMatchRequest(forfeitWinner.id);
      }
    }
  };

  useEffect(() => {
    if (winner && onMatchComplete) onMatchComplete(winner);
  }, [winner]);

  return (
    <Card className="mx-auto">
      <CardHeader className="flex justify-center items-center">
        <CardTitle>Tournament Match</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4 gap-4">
          {/* Player 1 Section */}
          <div className="text-center">
            <h4 className="text-lg font-semibold">{player1.userId}</h4>
            <div className="flex items-center gap-4 mt-2">
              {isAdmin && (
                <>
                  <Button onClick={() => decrementScore(setP1Score)} disabled={p1Score === 0}>-</Button>
                  <span className="text-lg">{p1Score}</span>
                  <Button onClick={() => incrementScore(setP1Score)}>+</Button>
                </>
              )}
            </div>
            {isAdmin && (
              <Button onClick={() => handleForfeit("player1")} variant="destructive" className="mt-2">
                Forfeit
              </Button>
            )}
          </div>

          <span className="font-bold text-xl">VS</span>

          {/* Player 2 Section */}
          {player2 && (
            <div className="text-center">
              <h4 className="text-lg font-semibold">{player2.userId}</h4>
              <div className="flex items-center gap-2 mt-2">
                {isAdmin && (
                  <>
                    <Button onClick={() => decrementScore(setP2Score)} disabled={p2Score === 0}>-</Button>
                    <span className="text-lg">{p2Score}</span>
                    <Button onClick={() => incrementScore(setP2Score)}>+</Button>
                  </>
                )}
              </div>
              {isAdmin && (
                <Button onClick={() => handleForfeit("player2")} variant="destructive" className="mt-2">
                  Forfeit
                </Button>
              )}
            </div>
          )}
        </div>

        {winner && (
          <div className="text-center text-xl font-semibold text-green-600">
            Winner: {winner.userId}
          </div>
        )}
      </CardContent>

      {isAdmin && (
        <CardFooter className="flex justify-center">
          <Button onClick={completeMatch} disabled={!!winner}>
            Complete Match
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BracketMatch;
