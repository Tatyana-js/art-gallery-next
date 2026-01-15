import Grid from '@/components/ui_kit/Grid';
import Skeletons from '@/components/ui_kit/Skeletons/Skeletons';

export default function LoadingArtistsPage() {
  return (
    <div className="padding-top-20">
      <Grid>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeletons key={idx} />
        ))}
      </Grid>
    </div>
  );
}
