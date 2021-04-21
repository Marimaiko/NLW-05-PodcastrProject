import style from './style.module.scss';

export function Player(){
  return(
    <div className={style.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando'/>
        <strong>Tocando agora</strong>
      </header>

      <div className={style.emptyPlayer}>
        <strong>Selecione alguma coisa </strong>
      </div>

      <footer className={style.empty}>
        <div className={style.progress}>
          <span>00:00</span>
          <div className={style.slider}>
           <div className={style.emptySlider} />
          </div>
          <span>00:00</span>
        </div>

        <div className={style.buttons}>
          <button type='button'>
            <img src='/shuffle.svg' alt='Embaralhar'/>
          </button>
          <button type='button'>
            <img src='/play-previous.svg' alt='Tocar anterior'/>
          </button>
          <button type='button' className={style.playButton}>
            <img src='/play.svg' alt='Tocar'/>
          </button>
          <button type='button'>
            <img src='/play-next.svg' alt='Tocar próximo'/>
          </button>
          <button type='button'>
            <img src='/repeat.svg' alt='Repetir'/>
          </button>
        </div>
      </footer>
    </div>
  )

}