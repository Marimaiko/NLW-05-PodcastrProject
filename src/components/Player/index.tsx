import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import style from './style.module.scss';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {currentEpisodeIndex, episodeList, isPlaying, togglePlay} = useContext(PlayerContext);
  const episode =episodeList[currentEpisodeIndex]

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
          <span>00:00</span>
          <div className={style.slider}>
           { episode ? (
             <Slider 
              trackStyle={{backgroundColor: '#04d661'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d661', borderWidth: 5}}
             />
           ) : (
             <div className={style.emptySlider} />
           )}
          </div>
          <span>00:00</span>
        </div>

            {/* Player na musica - && para if que não tem "else" */}
        { episode && (
          <audio 
            src={episode.url}
            autoPlay
            ref={audioRef}
          />
        )}

        <div className={style.buttons}>
          <button type='button' disabled={!episode}>
            <img src='/shuffle.svg' alt='Embaralhar'/>
          </button>
          <button type='button' disabled={!episode}>
            <img src='/play-previous.svg' alt='Tocar anterior'/>
          </button>
          <button type='button' className={style.playButton}  disabled={!episode} onClick={togglePlay}>
            { isPlaying ? (
              <img src='/pause.svg' alt='Tocar'/>
            ) : (
              <img src='/play.svg' alt='Tocar'/>
            )}
          </button>
          <button type='button' disabled={!episode}>
            <img src='/play-next.svg' alt='Tocar próximo'/>
          </button>
          <button type='button' disabled={!episode}>
            <img src='/repeat.svg' alt='Repetir'/>
          </button>
        </div>
      </footer>
    </div>
  )

}