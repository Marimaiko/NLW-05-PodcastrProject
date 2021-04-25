import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import style from './style.module.scss';
import { convertDuration } from '../../utils/convertDuration';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0);
  const {
    currentEpisodeIndex, 
    episodeList, 
    isPlaying, 
    isShuffling,
    toggleShuffle,
    togglePlay, 
    toggleLoop,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    clearPlayerState } = usePlayer();

  const episode = episodeList[currentEpisodeIndex]

  useEffect (() => {
    if(!audioRef.current) {
      return;
    }
    if(isPlaying){
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgress () {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek (amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded () {
    if(hasNext){
      playNext();
    } else{
      clearPlayerState();
    }
  }

  return(
    <div className={style.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando'/>
        <strong>Tocando agora: </strong>
      </header>

      { episode ? (
        <div className={style.playingEpisode}>
          <Image 
            width={590}
            height={590}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <p>{episode.members}</p>
        </div>
      ) : (
        <div className={style.emptyPlayer}>
          <strong>Selecione alguma coisa </strong>
        </div>
      )
      }

      <footer className={!episode ? style.empty : ''}>
        <div className={style.progress}>
        <span>{convertDuration(progress)}</span>  
          <div className={style.slider}>
           { episode ? (
             <Slider 
              max={episode.duration}
              value={progress}
              onChange={handleSeek}
              trackStyle={{backgroundColor: '#04d661'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d661', borderWidth: 5}}
             />
           ) : (
             <div className={style.emptySlider} />
           )}
          </div>
          {/* Verifica se tem algo tocando, senão é 0 */}
          <span>{convertDuration(episode?.duration ?? 0)}</span>    
        </div>

            {/* Play no audio - && para if que não tem "else" */}
        { episode && (
          <audio 
            src={episode.url}
            autoPlay
            onEnded={handleEpisodeEnded}
            loop={isLooping}
            ref={audioRef}
            onLoadedMetadata={setupProgress}
          />
        )}

        <div className={style.buttons}>
          <button 
            type='button' 
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle} 
            className={isShuffling ? style.isActive : ''}
          >
            <img src='/shuffle.svg' alt='Embaralhar'/>
          </button>
          <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src='/play-previous.svg' alt='Tocar anterior'/>
          </button>
          <button type='button' className={style.playButton}  disabled={!episode} onClick={togglePlay}>
            { isPlaying ? (
              <img src='/pause.svg' alt='Tocar'/>
            ) : (
              <img src='/play.svg' alt='Tocar'/>
            )}
          </button>
          <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
            <img src='/play-next.svg' alt='Tocar próximo'/>
          </button>
          <button 
            type='button' 
            disabled={!episode} 
            onClick={toggleLoop} 
            className={isLooping ? style.isActive : ''}
          >
            <img src='/repeat.svg' alt='Repetir'/>
          </button>
        </div>
      </footer>
    </div>
  )

}