import { Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useState } from 'react'

type Data = {
  name: string;
  sex: string;
  age: number;
  height: number;
  addr: string;
}

function createData(
  name: string,
  sex: string,
  age: number,
  height: number,
  addr: string
): Data {
  return {
    name,
    sex,
    age,
    height,
    addr,
  };
}
const datas = [
  createData('Cupcake', '男', 3.7, 67, '深圳'),
  createData('Donut', '男', 25.0, 51, '深圳'),
  createData('Eclair', '男', 16.0, 24, '深圳'),
  createData('Frozen yoghurt', '男', 6.0, 24, '深圳'),
  createData('Gingerbread', '男', 16.0, 49, '深圳'),
  createData('Honeycomb', '男', 3.2, 87, '深圳'),
  createData('Ice cream sandwich', '男', 9.0, 37, '深圳'),
  createData('Jelly Bean', '男', 0.0, 94, '深圳'),
  createData('KitKat', '男', 26.0, 65, '深圳'),
  createData('Lollipop', '男', 0.2, 98, '深圳'),
  createData('Marshmallow', '男', 0, 81, '深圳'),
  createData('Nougat', '男', 19.0, 9, '深圳'),
  createData('Oreo', '男', 18.0, 63, '深圳'),
]
const MyTable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (name: string) => {
    const index = selected.indexOf(name)
    console.log("name", name, "index", index);
    if (index < 0) {
      setSelected([...selected, name]);
    } else {
      selected.splice(index, 1)
      setSelected([...selected]);
    }
  }
  const hanldeAllClick = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    console.log('e', e);
    if (checked) {
      const newSelected = datas.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }
  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const numSelected = selected.length;
  const rowCount = datas.length;
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: "#CCC", display: 'flex' }}>
      <Box sx={{ width: '900px', margin: 'auto', height: '900px' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={hanldeAllClick}
                    />
                  </TableCell>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right" color='##adzxc'>Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datas.map((row) => (
                  <TableRow
                    onClick={() => handleClick(row.name)}
                    hover
                    key={row.name}
                    tabIndex={-1}
                    role="checkbox"
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected(row.name)}
                        inputProps={{
                          'aria-labelledby': `enhanced-table-checkbox-${row.name}`,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.sex}</TableCell>
                    <TableCell align="right">{row.age}</TableCell>
                    <TableCell align="right">{row.height}</TableCell>
                    <TableCell align="right">{row.addr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={datas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </div>

  )
}

export default MyTable