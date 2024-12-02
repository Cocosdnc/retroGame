/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ky from 'ky';
import { Settings, Trophy, Volume2, VolumeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
interface GameProps {
    greenBoxImageUrls: string[];
}

const Game: React.FC<GameProps> = ({ greenBoxImageUrls }) => {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [popFrequency, setPopFrequency] = useState(200)
    const [gameOver, setGameOver] = useState(false);
    const [elements, setElements] = useState<
        { id: number; type: "catch" | "avoid"; top: number; left: number; imageUrl: string }[]
    >([]);
    const [playerPosition, setPlayerPosition] = useState(50); // Percent
    const [speed, setSpeed] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [paused, setPaused] = useState(false); // Track whether the game is paused
    const playerRef = useRef<HTMLDivElement>(null);
    const backgroundAudioRef = useRef<HTMLAudioElement>(null);
    const catchAudioRef = useRef<HTMLAudioElement>(null);
    const gameoverAudioRef = useRef<HTMLAudioElement>(null);
    const [previousVolume, setPreviousVolume] = useState(0.5);
    const [scores, setScores] = useState<any>()
    const [pseudo, setPseudo] = useState(""); // Track the pseudo input
    // const [loading, setLoading] = useState<boolean>(false); // To track loading state
    const sendScore = async (scoreData: { pseudo: string; champion: string; score: number }) => {
        try {
            // Making a POST request to the server using Ky
            const response = await ky.post('/api/score', {
                json: scoreData, // The data to send
            });

            // If the response is successful, parse the JSON
            const data = await response.json();
            console.log('Score successfully submitted:', data);
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch('/api/score/champion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ champion: 'jacqueslalie' }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                setScores(data);
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        };

        fetchScores();
    }, []);

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    };
    const handleMouseMove = (e: MouseEvent) => {
        if (!gameAreaRef.current) return;

        const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
        const mouseX = e.clientX;

        // Calculate new position as a percentage
        const newPosition = ((mouseX - gameAreaRect.left) / gameAreaRect.width) * 100;

        // Clamp the position between 0 and 100
        setPlayerPosition(Math.max(0, Math.min(100, newPosition)));
    };
    useEffect(() => {
        if (gameStarted) {
            // Add mousemove event listener when the game starts
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            // Cleanup event listener when the game stops
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [gameStarted]);

    useEffect(() => {
        if (isMobile()) {
            setSpeed(0.5); // Slower speed for mobile
            setPopFrequency(800)
        } else {
            setSpeed(3); // Default speed for desktop
            setPopFrequency(200)
        }
    }, []);

    const toggleMute = () => {
        if (backgroundAudioRef.current) {
            if (backgroundAudioRef.current.volume > 0) {
                setPreviousVolume(backgroundAudioRef.current.volume);
                backgroundAudioRef.current.volume = 0; // Mute
            } else {
                backgroundAudioRef.current.volume = previousVolume; // Restore volume
            }
        }
    };

    useEffect(() => {
        if (gameStarted) {
            backgroundAudioRef.current?.play().catch(() => console.warn("Background audio playback failed."));
        }
    }, [gameStarted]);

    useEffect(() => {
        if (gameStarted && !paused) {
            const interval = setInterval(() => {
                const randomImageUrl =
                    greenBoxImageUrls[Math.floor(Math.random() * greenBoxImageUrls.length)];
                setElements((prevElements) => [
                    ...prevElements,
                    {
                        id: Date.now(),
                        type: Math.random() > 0.5 ? "catch" : "avoid",
                        top: 0,
                        left: Math.random() * 100, // Percent
                        imageUrl: randomImageUrl,
                    },
                ]);
            }, popFrequency);

            return () => clearInterval(interval);
        }
    }, [gameStarted, paused, greenBoxImageUrls,popFrequency]);

    useEffect(() => {
        if (gameStarted && !paused) {
            const moveInterval = setInterval(() => {
                setElements((prevElements) =>
                    prevElements.map((element) => ({
                        ...element,
                        top: element.top + speed / 10,
                    }))
                );
            }, 5);
            setPopFrequency(prev=>prev-5)
            return () => clearInterval(moveInterval);
        }
    }, [gameStarted, speed, paused]);

    const gameAreaRef = useRef<HTMLDivElement>(null); // Reference for the game area
    const specificAudioRefs = useRef<Record<string, HTMLAudioElement>>({});

    // Inside your component initialization
    useEffect(() => {
        // Map specific image URLs to their corresponding sounds
        specificAudioRefs.current = {
            "/money.png": new Audio("/money.mp3"),
            "/alcool.png": new Audio("/alcool.mp3"),
            // Add as many as needed
        };

        // Ensure all audio files are preloaded
        Object.values(specificAudioRefs.current).forEach((audio) => {
            audio.load();
        });

        return () => {
            // Clean up audio objects on unmount
            Object.values(specificAudioRefs.current).forEach((audio) => audio.pause());
        };
    }, []);

    useEffect(() => {
        if (gameStarted && !paused) {
            const checkCollision = setInterval(() => {
                if (!playerRef.current || !gameAreaRef.current) return;

                const playerRect = playerRef.current.getBoundingClientRect();
                const gameAreaRect = gameAreaRef.current.getBoundingClientRect();

                setElements((prevElements) =>
                    prevElements.filter((element) => {
                        const elementTopPx = (element.top / 100) * gameAreaRect.height + gameAreaRect.top;
                        const elementLeftPx = (element.left / 100) * gameAreaRect.width + gameAreaRect.left;

                        const isTouching =
                            playerRect.top < elementTopPx + 60 &&
                            playerRect.bottom > elementTopPx &&
                            playerRect.left < elementLeftPx + 60 &&
                            playerRect.right > elementLeftPx;

                        if (isTouching) {
                            if (element.type === "catch") {
                                setScore((prev) => prev + 1);
                                const soundToPlay = specificAudioRefs.current[element.imageUrl];
                                soundToPlay?.play().catch(() => console.warn(`Sound playback failed for ${element.imageUrl}`));
                            } else {
                                setPaused(true)
                                setGameOver(true);
                                gameoverAudioRef.current?.play().catch(() =>
                                    console.warn("Catch audio playback failed.")
                                );
                                backgroundAudioRef.current?.pause();
                            }
                            return false;
                        }

                        return true;
                    })
                );
            }, 5);

            return () => clearInterval(checkCollision);
        }
    }, [gameStarted, elements, paused]);

    useEffect(() => {
        let moveInterval: number | null = null; // Use `number` for browser compatibility

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                if (!moveInterval) {
                    moveInterval = window.setInterval(() => {
                        setPlayerPosition((prev) => {
                            if (e.key === "ArrowLeft") {
                                return Math.max(0, prev - 1); // Move left
                            } else if (e.key === "ArrowRight") {
                                return Math.min(100, prev + 1); // Move right
                            }
                            return prev;
                        });
                    }, 8); // ~60 FPS (16ms interval)
                }
            }

            if (e.key === " " && gameStarted) {
                // Toggle pause when Space key is pressed
                setPaused((prev) => !prev);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                if (moveInterval !== null) {
                    clearInterval(moveInterval);
                    moveInterval = null;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (moveInterval !== null) clearInterval(moveInterval);
        };
    }, [gameStarted]);

    useEffect(() => {
        if (gameStarted && !paused) {
            const speedInterval = setInterval(() => {
                setSpeed((prev) => Math.min(prev + 1, 20)); // Cap speed at 20
            }, 10000);

            return () => clearInterval(speedInterval);
        }
    }, [gameStarted, paused]);

    const startGame = () => setGameStarted(true);

    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        setElements([]);
        setSpeed(3);
        setGameStarted(false);
        setPaused(false); // Reset pause state on restart
        backgroundAudioRef.current?.pause();
        backgroundAudioRef.current!.currentTime = 0;
    };

    if (!gameStarted) {
        return (
            <div className="relative h-screen bg-gray-100 overflow-hidden justify-center items-center flex " style={{ backgroundImage: "url(/bg.png)" }}>

                <button onClick={startGame} className="p-4 bg-blue-500  text-white rounded">
                    C&apos;est parti !
                </button>
            </div>
        );
    }


    // const toggleMute = () => {
    //     setMuted((prev) => !prev);
    //     backgroundAudioRef.current?.pause();
    // };

    const quitGame = () => {
        setGameStarted(false);
        setGameOver(true);
        setPaused(false);
        router.push("/")
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setPlayerPosition(() => Math.max(0, Math.min(100, (touch.clientX / window.innerWidth) * 100)));
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setPlayerPosition(() => Math.max(0, Math.min(100, (touch.clientX / window.innerWidth) * 100)));
    };
    const changeVolume = (value: number) => {
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.volume = Math.max(0, Math.min(1, value)); // Clamp value between 0 and 1
        }
    };

    return (
        <div className="relative h-screen bg-gray-100 overflow-hidden justify-center flex " style={{ backgroundImage: "url(/bg.png)" }}>
            <audio ref={backgroundAudioRef} src="/background_1.mp3" loop />
            <audio ref={catchAudioRef} src="/catch-sound.mp3" />
            <audio ref={gameoverAudioRef} src="/gameover.mp3" />

            <div className="absolute top-8 left-8 text-white text-xl z-10">Score: {score}</div>
            <div className="absolute top-8 right-8 text-white text-xl z-10 cursor-pointer" onClick={() => setPaused(prev => !prev)}> <Settings /></div>
            {paused && (
                <div className="absolute shadow-md bg-zinc-800 border-[1px] border-white p-4 flex flex-col items-center rounded-md border-zinc 400 top-1/2 z-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
                    <div>Paused</div>
                    <button onClick={toggleMute} className="mt-4 p-2 bg-gray-500 text-white rounded">
                        {backgroundAudioRef.current && backgroundAudioRef.current?.volume > 0 ? <VolumeOff /> : <Volume2 />}
                    </button>
                    <div>

                        <label htmlFor="volume-slider" className="text-white">Volume</label>
                        <input
                            id="volume-slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            defaultValue="0.5"
                            onChange={(e) => changeVolume(Number(e.target.value))}
                        />
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button onClick={() => setPaused(false)} className="p-2 bg-green-500 text-white rounded">
                            Continue
                        </button>
                        <button onClick={restartGame} className="mt-2 p-2 bg-blue-500 text-white rounded">
                            Recommencer
                        </button>
                        <button onClick={quitGame} className="mt-2 p-2 bg-red-500 text-white rounded">
                            Quitter
                        </button>
                    </div>
                </div>
            )}
            {gameOver && (
                <div className="absolute w-full max-w-[600px] h-fit shadow-lg bg-zinc-800 border-[1px] border-white p-4 flex flex-col items-center rounded-md border-zinc 400 top-1/2 z-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
                    <div className="font-bold text-red-600 text-2xl">Game Over</div>
                    <h1>Votre score: {score}</h1>
                    <div className="mt-4 gap-4 flex">
                        <button onClick={restartGame} className="mt-2 p-2 bg-blue-500 text-white rounded">
                            Recommencer
                        </button>
                        <button onClick={quitGame} className="mt-2 p-2 bg-red-500 text-white rounded">
                            Quitter
                        </button>
                    </div>
                    <div className="text-sm mt-3">
                        <p className="text-md font-semibold">Meilleurs scores</p>
                        {scores.length > 0 ? (
                            scores?.slice(0, 3).map((score: any) => (
                                <div key={score.pseudo}>
                                        <p className="flex flex-row gap-2"><Trophy className="size-4"/> {score.pseudo}: {score.score} pts</p>
                                </div>
                            ))
                        ) : (
                            <p>No scores found.</p>
                        )}
                    </div>
                    <div className="mt-6 border-t-2 border-white pt-4 flex flex-col text-md justify-center items-center">
                        Enregistrez votre score
                        <input
                            className="border-2 rounded-md p-2 text-black"
                            placeholder="Votre pseudo"
                            value={pseudo} // Bind input value to state
                            onChange={(e) => setPseudo(e.target.value)} // Update state on input change
                        />
                        <button
                            onClick={() => sendScore({ pseudo, champion: "jacqueslalie", score })} // Send the state values
                            className="mt-2 p-2 bg-green-500 rounded"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}
            <div
                ref={gameAreaRef}
                className="relative w-full max-w-[20cm] h-full bg-cover bg-center border-zinc-400"
                style={{ backgroundImage: "url(/background.jpg)" }}
            >
                <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    ref={playerRef}
                    className="absolute bottom-4 w-20 h-20 sm:w-14 sm:h-14 bg-cover"
                    style={{
                        left: `${playerPosition}%`,
                        transform: "translateX(-50%)",
                        backgroundImage: "url(/JacquesLalie.png)",
                    }}
                ></div>
                {elements.map((element) => (
                    <div
                        key={element.id}
                        className="absolute w-20 h-20 sm:w-14 sm:h-14 bg-cover"
                        style={{
                            top: `${element.top}%`,
                            left: `${element.left}%`,
                            backgroundImage: `url(${element.type === "avoid" ? "/police.png" : element.imageUrl})`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Game;
