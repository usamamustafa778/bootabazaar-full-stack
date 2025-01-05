import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCustomers = [
          { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com', 
            phone: '123-456-7890', 
            status: 'Active',
            orders: [
              { id: 1, date: '2024-03-15', amount: 150.00 },
              { id: 2, date: '2024-03-20', amount: 75.50 }
            ]
          },
          { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane@example.com', 
            phone: '098-765-4321', 
            status: 'Active',
            orders: [
              { id: 3, date: '2024-03-18', amount: 200.00 }
            ]
          },
          { 
            id: 3, 
            name: 'Bob Johnson', 
            email: 'bob@example.com', 
            phone: '555-555-5555', 
            status: 'Inactive',
            orders: []
          },
        ];
        
        // Filter to only show customers with orders
        const customersWithOrders = mockCustomers.filter(customer => customer.orders.length > 0);
        setCustomers(customersWithOrders);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2c3e50' }}>
        Customers with Orders
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Orders</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No customers with orders found</TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id} sx={{ '&:hover': { backgroundColor: '#f5f6f7' } }}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: customer.status === 'Active' ? '#e1f7e1' : '#ffe1e1',
                        color: customer.status === 'Active' ? '#2e7d32' : '#d32f2f',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: '16px',
                        display: 'inline-block',
                        fontSize: '0.875rem',
                      }}
                    >
                      {customer.status}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.orders.length}</TableCell>
                  <TableCell>
                    ${customer.orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers;
