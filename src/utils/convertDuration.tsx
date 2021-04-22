//Arquivo para converter os dados da duração para uma string formatada

export function convertDuration(duration:number) {
  const hours = Math.floor(duration / (60*60));       //Math.floor utilizado para arredondamento
  const minutes = Math.floor((duration%3600)/60);
  const seconds = duration%60;

  const result = [hours, minutes, seconds]
  .map(unit => String(unit).padStart(2, '0'))
  .join(':');

  return result;
 }