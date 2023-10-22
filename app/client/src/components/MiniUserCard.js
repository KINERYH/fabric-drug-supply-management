import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';

export default function MiniUserCard(props) {
  return (
    <Card orientation="vertical" sx={{ maxWidth: '80%' }}>
      <Typography level="body-mg">{props.title}</Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar color="primary" variant="outlined" size="sm">{props.user?.Name.charAt(0)}</Avatar>
        <Typography level="body-lg">{props.user?.Name} {props.user?.Surname}</Typography>
      </Box>
      { props.user?.Specialization &&
        <Typography startDecorator={props.firstIcon}  level="body-sg" sx={{ marginLeft:'5px' }}>
          {props.user?.Specialization}
        </Typography>
      }
      <Typography startDecorator={props.secondIcon}  level="body-sg" sx={{ marginLeft:'5px' }}>
        {props.user?.Hospital || props.user?.Address}
      </Typography>
    </Card>
  );
}