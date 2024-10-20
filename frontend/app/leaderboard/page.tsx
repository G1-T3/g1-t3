"use client";

import React from "react";
import { useEffect, useState } from "react";
import { LeaderboardPosition } from "@/components/ui/leaderboardPosition";
import axiosInstance from "@/lib/axios";
// import { data } from '@/app/leaderboard/db.js';

// data.sort((a, b) => {
//     if (a.score < b.score) {
//         return 1;
//     } else {
//         return -1
//     }
// });
const API_URL = `${process.env.NEXT_PUBLIC_SPRINGBOOT_API_URL}`;

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      axiosInstance
        .get(new URL("/leaderboard", API_URL).toString())
        .then((response) => {
          setData(response.data);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  console.log(data);
  return (
    <div className="flex flex-col items-center mt-16 pt-4 pb-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="w-4/5 h-auto bg-card">
        <ul>
          {data.map(({ firstName, lastName, elo, profileId }, idx) => (
            <li key={profileId}>
              <LeaderboardPosition
                name={firstName + " " + lastName}
                position={++idx}
                rating={elo}
                profileId={profileId}
              ></LeaderboardPosition>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
