import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

export default function UserCard() {
  return (
    <Box sx={{ width: '100%' }} >
      <Card
        orientation="horizontal"
        sx={{
          width: '100%',
          flexWrap: 'wrap'
        }}
      >
        <AspectRatio flex ratio="1" maxHeight={70} sx={{ minWidth: 150 }}>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
            srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </AspectRatio>
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            Alex Morrison
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
            Senior Journalist
          </Typography>
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Total prescriptions
              </Typography>
              <Typography fontWeight="lg">34</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Pending prescriptions
              </Typography>
              <Typography fontWeight="lg">980</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Processed prescriptions
              </Typography>
              <Typography fontWeight="lg">8.9</Typography>
            </div>
          </Sheet>
          <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="outlined" color="neutral">
              Edit info
            </Button>
            <Button variant="solid" color="primary">
              Do something
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
