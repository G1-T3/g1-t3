import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlayerProfile } from '@/types/player';
import { useGeolocation } from '@/hooks/useGeolocation'; // Create this custom hook

interface QueueManagementProps {
    playerId: string;
    onMatchFound: (matchFound: boolean, opponentName: string, meetingPoint: [number, number], opponentProfile: PlayerProfile) => void;
}

interface MatchNotification {
    match: {
        meetingLatitude: number;
        meetingLongitude: number;
    };
    opponentName: string;
    opponentProfile: PlayerProfile;
}

const QueueManagement: React.FC<QueueManagementProps> = ({ playerId, onMatchFound }) => {
    const [inQueue, setInQueue] = useState(false);
    const [queueTime, setQueueTime] = useState(0);
    const [matchFound, setMatchFound] = useState(false);
    const [opponentName, setOpponentName] = useState('');
    const { client, connected } = useWebSocket();
    const { location } = useGeolocation(); // Use the custom geolocation hook

    useEffect(() => {
        if (client && connected) {
            const subscription = client.subscribe(`/topic/solo/match/${playerId}`, (message) => {
                try {
                    const notification: MatchNotification = JSON.parse(message.body);
                    console.log('Match found:', notification);
                    setMatchFound(true);
                    setInQueue(false);
                    setOpponentName(notification.opponentName);
                    onMatchFound(true, notification.opponentName, [notification.match.meetingLatitude, notification.match.meetingLongitude], notification.opponentProfile);
                } catch (error) {
                    console.error('Error parsing match data:', error);
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [client, connected, playerId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (inQueue) {
            interval = setInterval(() => {
                setQueueTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            setQueueTime(0);
        }
        return () => clearInterval(interval);
    }, [inQueue]);

    useEffect(() => {
        if (client && connected) {
            const subscription = client.subscribe(`/topic/solo/match/${playerId}`, (message) => {
                try {
                    const match = JSON.parse(message.body);
                    console.log('Match found:', match);
                    setMatchFound(true);
                    setInQueue(false);
                    setOpponentName(match.opponentName);
                    onMatchFound(true, match.opponentName, [match.meetingLatitude, match.meetingLongitude], match.opponentProfile);
                } catch (error) {
                    console.error('Error parsing match data:', error);
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [client, connected, playerId]);

    const joinQueue = () => {
        if (client && connected && location) {
            console.log('Sending join queue request for player:', playerId);
            client.publish({
                destination: '/app/solo/queue',
                body: JSON.stringify({
                    playerId: playerId,
                    location: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                })
            });
            setInQueue(true);
        } else {
            console.error('Cannot join queue: client not connected or location not available');
        }
    };

    const leaveQueue = () => {
        if (client && connected) {
            client.publish({ destination: '/app/solo/dequeue', body: playerId });
            setInQueue(false);
        }
    };

    return (
        <div className="p-4">
            {matchFound ? (
                <Alert>
                    <AlertTitle>Match Found!</AlertTitle>
                    <AlertDescription>
                        Prepare for your arm wrestling match against {opponentName}.
                    </AlertDescription>
                </Alert>
            ) : inQueue ? (
                <div>
                    <p>In Queue: {Math.floor(queueTime / 60)}:{queueTime % 60 < 10 ? '0' : ''}{queueTime % 60}</p>
                    <Button onClick={leaveQueue}>Leave Queue</Button>
                </div>
            ) : (
                <Button variant="outline"
                    onClick={joinQueue}
                    className='hover:text-muted'
                    disabled={!connected}>
                    Join Queue
                </Button>
            )}
        </div>
    );
};

export default QueueManagement;