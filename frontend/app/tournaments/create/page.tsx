// CreateTournament.tsx
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TournamentForm from '@/components/tournaments/TournamentForm1';
import AdditionalDetailsForm from '@/components/tournaments/TournamentForm2';
import { Tournament } from '@/types/tournament';

const API_URL = process.env.NEXT_PUBLIC_SPRINGBOOT_API_URL;
const WEB_URL = process.env.NEXT_PUBLIC_API_URL;

const CreateTournament = () => {
  const router = useRouter();

  // State to control the form step (1 for Basic Info, 2 for Additional Details)
  const [step, setStep] = useState(1);

  // Tournament state
  const [tournament, setTournament] = useState<Tournament>({
    name: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    status: 'open',
    deadlineDate: '',
    deadlineTime: '',
    maxParticipants: 0,
    description: '',
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTournament({
      ...tournament,
      [name]: value
    });
  };

  // Handle next step
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // Handle going back to the previous step
  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate maxParticipants before sending the request
    if (tournament.maxParticipants <= 0) {
      alert("Max participants must be a positive number");
      return;
    }

    const startdatetime = `${tournament.startDate}T${tournament.startTime}:00`;
    const enddatetime = `${tournament.endDate}T${tournament.endTime}:00`;
    const deadline = `${tournament.deadlineDate}T${tournament.deadlineTime}:00`;

    const { startDate, startTime, endDate, endTime, deadlineDate, deadlineTime, ...tournamentDetails } = tournament;

    const data = {
      ...tournamentDetails,
      startDate: startdatetime,
      endDate: enddatetime,
      deadline: deadline
    };

    try {
      const res = await fetch(API_URL + '/tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        router.push(WEB_URL + '/tournaments'); // Redirect after successful creation
      } else {
        alert('Error creating tournament');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <div className="mt-20 flex flex-col items-center justify-center mx-auto min-h-screen bg-primary-foreground">
      {step === 1 && (
        <TournamentForm
          tournament={tournament}
          handleChange={handleChange}
          handleSubmit={handleNext}
          buttonLabel="Next"
        />
      )}

      {step === 2 && (
        <AdditionalDetailsForm
          tournament={tournament}
          handleChange={handleChange}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CreateTournament;
