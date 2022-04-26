import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Skeletons() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" width="100" height={118} />
      <Skeleton variant="text" width={150} height={30}  />
      <Skeleton variant="text" width={100} height={30}  />
    </Stack>
  );
}