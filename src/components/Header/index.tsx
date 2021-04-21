import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import style from './style.module.scss';

export function Header(){
  const currentDate = format(new Date(), 'EEEE, d MMMM', {
    locale: ptBR,
  });

  return(
    <header className={style.headerContainer}>
      <img src='/logo.svg' alt='Logo podcastr'></img>
      <p>Textinho bonito pro site que to fazendo com Next</p>
      <span>{currentDate}</span>
    </header>
  );
}