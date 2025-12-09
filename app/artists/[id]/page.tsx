interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Artist Details</h1>
      <p>Artist ID: {id}</p>
      <p>This page is currently being developed.</p>
    </main>
  );
}
