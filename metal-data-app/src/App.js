import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';

// Replace with your backend API URL
const API_URL = 'http://localhost:8000/api/metal-data';

function App() {
  const [metals, setMetals] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/metals`)
      .then((res) => res.json())
      .then((data) => setMetals(data));
    fetch(`${API_URL}/years`)
      .then((res) => res.json())
      .then((data) => setYears(data));
  }, []);

  const fetchData = () => {
    fetch(`${API_URL}?metal=${selectedMetal}&year=${selectedYear}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);

        const chartData = {
          labels: data.map((item) => item.source),
          datasets: [
            {
              label: `${selectedMetal} Data (${selectedYear})`,
              data: data.map((item) => item.value),
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)',
              ],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            },
          ],
        };
        setChartData(chartData);
      });
  };

return (
  <Container maxWidth="md">
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Non-Ferrous Metal Data
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Metal</InputLabel>
        <Select
          value={selectedMetal}
          onChange={(e) => setSelectedMetal(e.target.value)}
        >
          {metals.map((metal) => (
            <MenuItem key={metal} value={metal}>
              {metal}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Year</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button onClick={fetchData}>Fetch Data</button>
      {data.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.source}>
                    <TableCell component="th" scope="row">
                      {item.source}
                    </TableCell>
                    <TableCell align="right">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={4}>
            <Bar data={chartData} />
          </Box>
        </>
      )}
    </Box>
  </Container>
);
