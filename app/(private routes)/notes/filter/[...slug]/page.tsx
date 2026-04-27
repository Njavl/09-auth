import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

const OG_IMAGE = 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? 'all' : slug[0];
  const label = tag === 'all' ? 'All notes' : tag;

  return {
    title: `${label} | NoteHub`,
    description: `Browse notes filtered by: ${label}`,
    openGraph: {
      title: `${label} | NoteHub`,
      description: `Browse notes filtered by: ${label}`,
      url: `https://notehub.app/notes/filter/${tag}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
