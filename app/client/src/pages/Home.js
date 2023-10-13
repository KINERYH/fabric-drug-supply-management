import * as React from 'react';
import '../css/Home.css';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Button from '@mui/joy/Button';
import UserCard from '../components/UserCard';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
];

function Home() {
  return (
    <Sheet className="Home">      
      <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ maxWidth: '60%', marginBottom: '20px' }}>
          <UserCard />
        </Box>
        <Sheet sx={{ maxWidth: '100%', display: 'flex', flexDirection: 'row' }}>
          <Sheet sx={{ minWidth: '50%' }}>
            <Typography level="h4" textAlign="left" sx={{ mb: 2, marginBottom: 0 }}>
              Current prescriptions.
            </Typography>
          </Sheet>
          <Sheet sx={{ minWidth: '50%', display: 'flex', justifyContent: 'right', marginBottom:'8px' }}>
            <ButtonGroup variant="solid" color="primary">
              <Button>Add prescription</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Sheet>
        </Sheet>
        <Sheet variant="outlined" sx={{ 
          height: 300, 
          overflow: 'auto',
          borderRadius: '10px',
          '& Table thead th': { 
            verticalAlign: 'middle',
            backgroundColor: "#eeeeee"
          },
          '& Table thead th:last-of-type': {
            borderTopRightRadius: 0
          }
          }}>
          <Table borderAxis="xBetween" variant="plain" stickyHeader>
            <thead>
              <tr>
                <th>Column width (60%)</th>
                <th>Calories1</th>
                <th>Fat&nbsp;(g)</th>
                <th>Carbs&nbsp;(g)</th>
                <th>Protein&nbsp;(g)</th>
              </tr> 
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.calories}</td>
                  <td>{row.fat}</td>
                  <td>{row.carbs}</td>
                  <td>{row.protein}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>
    </Sheet>
  );
}
export default Home;