import * as React from 'react';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function BasicBreadcrumbs(props) {
  return (
    <Breadcrumbs aria-label="breadcrumbs">
      <Link color="neutral" href="/">
        <HomeRoundedIcon sx={{ mr: 0.3 }} />
      </Link>
      { props.navigation.filter(item => item.href != null)
        .map((item) => (
          <Link key={item.name} color="neutral" href={item.href}>
            {item.name}
          </Link>
      ))}
      <Typography>{ props.navigation.filter(item => item.href == null).pop().name }</Typography>
    </Breadcrumbs>
  );
}