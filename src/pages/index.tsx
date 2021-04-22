import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDuration } from '../utils/convertDuration';
import style from './home.module.scss';
import Image from 'next/image';
import Link from 'next/link';

//Tipagem TypeScript
type Episode = {              //chaves para indicar objeto
  id: string;
  title: string;
  members: string; 
  description: string;
  duration: number;
  durationString: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
}
type HomeProps = {
  lastVideos:Episode[];         //ou Array<Episode>
  allVideos:Episode[]; 
}
// type HomeProps = {          Outra forma de escrever
//   episodes:Array<{
//     id: string;
//     title: string;       
//     members: string;
//     //...
//   }>
// }

export default function Home({lastVideos, allVideos}: HomeProps) {
  return (
    <div className={style.homePage}>
      <section className={style.latestVideos}>
        <h2>Últimos vídeos lançados</h2>
        <ul>
          {lastVideos.map((episode) => {
            return(
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit='cover'
                />
                <div className={style.VideosDetail}>
                  <Link href={`episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationString}</span>
                </div>
                <button>
                  <img src='/play-green.svg' alt='Toca episodio'/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={style.allVideos}>
          <h2>Todos os vídeos</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allVideos.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{width:75}}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail} 
                        alt={episode.title}
                        objectFit='cover'
                      />
                    </td>
                    <td>
                      <Link href={`episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationString}</td>
                    <td>
                      <button type='button'>
                        <img src='/play-green.svg' alt='Toca episodio'/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      order: 'desc',
    }
  });
  // const data = response.data;

  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationString: convertDuration(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const lastVideos = episodes.slice(0, 2);
  const allVideos = episodes.slice(0, episodes.length);

  return {
    props: {
      lastVideos,
      allVideos
    },
    revalidate: 60*60*8,
  }
}