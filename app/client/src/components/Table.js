import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function ExtendedTable(props) {
  return (
    <Sheet variant="outlined"
      sx={{
        width: '100%',
        overflow: 'auto',
        borderRadius: 'sm',
        '& Table thead th': {
          verticalAlign: 'middle',
          backgroundColor: "#eeeeee"
        },
        '& Table thead th:last-of-type': {
          borderTopRightRadius: 0
        }
      }}>
      <Table size="sm" borderAxis="bothBetween" variant="plain" stickyHeader
        sx={{ '& thead th:nth-of-type(1)': { width: '30%' } }}>
        <thead>
          <tr>
            { props.dataTable?.header.map( (title) => (
              <th>&nbsp;&nbsp;&nbsp;{title}</th>
            )) }
          </tr>
        </thead>
        <tbody>
          { props.dataTable?.body.map((row) => (
            <tr key={ row[0].display }>
              { row.map((column) => (
                <td>
                  { column?.favicon
                    ? <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Avatar size="sm">{column?.display?.charAt(0)}</Avatar>
                        {column?.display}
                      </Box>
                    : column?.url
                      ? <Link href={ column.url }>{ column.display }</Link>
                      : column?.chipStatus
                        ? <Chip
                            variant="soft"
                            size="sm"
                            startDecorator={
                              {
                                pending: <AutorenewRoundedIcon />,
                                processed: <CheckRoundedIcon  />,
                                shipped: <LocalShippingIcon />
                              }[column.display]
                            }
                            color={
                              {
                                pending: 'neutral',
                                processed: 'success',
                                shipped: 'warning'
                              }[column.display]
                            }
                          >
                            { column.display }
                          </Chip>
                        : column?.display
                  }
                </td>
              )) }
            </tr>
          )) }
        </tbody>
      </Table>
    </Sheet>
  );
}