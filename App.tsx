import React, { useState } from 'react';
import GameView from './components/GameView';
import { GameState } from './types';
import { STORY_BRIEF } from './constants';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [showBrief, setShowBrief] = useState(false);

  const startGame = () => setGameState(GameState.PLAYING);
  
  const handleGameOver = (win: boolean) => {
    setGameState(win ? GameState.VICTORY : GameState.GAME_OVER);
  };

  const resetGame = () => setGameState(GameState.MENU);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* CRT Effects */}
      <div className="scanlines"></div>
      <div className="crt-flicker"></div>

      {gameState === GameState.MENU && (
        <div className="text-center z-10 p-8 border-4 border-double border-pink-500 bg-black/80 shadow-[0_0_50px_rgba(255,0,100,0.5)] max-w-2xl w-full mx-4">
          <h1 className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-8 animate-pulse tracking-tighter" style={{ fontFamily: '"Press Start 2P"' }}>
            DESI FIRANGAN'S <br/> QUEST
          </h1>
          <p className="text-pink-300 text-xs md:text-sm mb-8 tracking-widest">TO MADAME SPICE'S HEART</p>
          
          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-red-600 text-white font-bold hover:bg-red-500 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all w-64"
            >
              START JOURNEY
            </button>
            
            <button 
              onClick={() => setShowBrief(true)}
              className="px-8 py-4 bg-purple-600 text-white font-bold hover:bg-purple-500 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all w-64"
            >
              READ FILE
            </button>
          </div>
          
          <div className="mt-8 text-gray-500 text-[10px]">
             EST. MAY 2023 | OMEGLE
          </div>
        </div>
      )}

      {showBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="bg-gray-800 border-2 border-green-500 p-6 max-w-2xl w-full h-[80vh] overflow-y-auto relative shadow-[0_0_30px_rgba(0,255,0,0.2)]">
             <button 
               onClick={() => setShowBrief(false)}
               className="absolute top-4 right-4 text-green-500 hover:text-white"
             >
               [X] CLOSE
             </button>
             <h2 className="text-green-500 text-xl mb-4 border-b border-green-500 pb-2">Top Secret: Mission Brief</h2>
             <div className="text-green-300 font-mono text-sm leading-loose whitespace-pre-wrap">
               {STORY_BRIEF}
             </div>
          </div>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <GameView onGameOver={handleGameOver} onExit={resetGame} />
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="text-center z-10 text-white">
          <h2 className="text-5xl text-red-600 mb-4">GAME OVER</h2>
          <p className="mb-8">Don't give up on love.</p>
          <button onClick={resetGame} className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200">TRY AGAIN</button>
        </div>
      )}

      {gameState === GameState.VICTORY && (
        <div className="text-center z-10 text-white bg-black/90 p-8 border-4 border-pink-500 relative overflow-hidden w-full max-w-3xl h-[90vh] flex flex-col items-center justify-center">
           {/* Falling Hearts Effect */}
           <div className="absolute inset-0 pointer-events-none opacity-20 animate-pulse text-red-500 text-4xl">
             ♥ ♥ ♥ ♥ ♥
           </div>

          <h2 className="text-3xl md:text-4xl text-pink-500 mb-4 animate-bounce">MISSION ACCOMPLISHED</h2>
          <div className="text-6xl mb-6">💖 💍 💖</div>
          
          <p className="mb-6 text-sm md:text-lg max-w-md mx-auto leading-relaxed">
            Happy Valentine's Day, Harvey!
            <br/><br/>
            I love you more than Biryani.
          </p>

          <div className="w-full max-w-md mb-6">
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/track/6ft9PAgNOjmZ2kFVP7LGqb?utm_source=generator" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>

          <button onClick={resetGame} className="px-6 py-3 bg-pink-600 text-white font-bold hover:bg-pink-500">REPLAY MEMORIES</button>
        </div>
      )}
    </div>
  );
}

export default App;