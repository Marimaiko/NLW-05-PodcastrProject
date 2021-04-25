//sem o underline no nome do arquivo, cria uma rota da aplicação

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../context/PlayerContext';
import { api } from '../../services/api';
import { convertDuration } from '../../utils/convertDuration';
import style from './episode.module.scss';

type Episode ={
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

type EpisodeProps ={
  episode:Episode
}

export default function Episode({episode}: EpisodeProps) {
const { play } = usePlayer();

  return (
    <div className={style.episodes}>
    <Head>
    <title>{episode.title} | Podcastr</title>
  </Head>
      <div className={style.thumbnailContainer}>
        <Link href='/'>
          <button type='button'>
            <img src="/arrow-left.svg" alt='Voltar'/>
          </button>
        </Link>
        <Image 
         width={700} 
         height={162} 
         src={episode.thumbnail} 
         objectFit='cover'
        />
        <button type='button' onClick={() => play(episode)}>
          <img src="/play.svg" alt='Play no ep'/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationString}</span>
      </header>

      <div 
        className={style.description} 
        dangerouslySetInnerHTML= {{__html:episode.description}} 
      />
          
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths:[],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;
  const { data } = await api.get(`/episodes/${slug}`);
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    duration: Number(data.file.duration),
    durationString: convertDuration(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }
  
  return{
    props:{
      episode
    },
    revalidate: 60*60*24,  //24h
  }
}