import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DownloadIcon from '@mui/icons-material/Download';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PaymentInterface = ({ amount = 5000, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCardChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setCardDetails({ ...cardDetails, [field]: formattedValue });
  };

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentComplete?.();
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Transaction ID: TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ReceiptIcon />}
          sx={{ mt: 2 }}
        >
          Download Receipt
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Amount Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Application Fee</Typography>
                <Typography variant="body2">₹{amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Processing Fee</Typography>
                <Typography variant="body2">₹{(amount * 0.02).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">GST (18%)</Typography>
                <Typography variant="body2">₹{(amount * 0.18).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h6" color="primary">
                  ₹{(amount * 1.2).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mt: 2 }}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCardIcon />
                      <span>Credit / Debit Card</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="netbanking"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceIcon />
                      <span>Net Banking</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceWalletIcon />
                      <span>UPI</span>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Enter Card Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => handleCardChange('number', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 19 }}
                      InputProps={{
                        endAdornment: <CreditCardIcon color="action" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      value={cardDetails.name}
                      onChange={(e) => handleCardChange('name', e.target.value)}
                      placeholder="JOHN DOE"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardChange('cvv', e.target.value)}
                      placeholder="123"
                      type="password"
                      inputProps={{ maxLength: 3 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Net Banking */}
            {paymentMethod === 'netbanking' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Your Bank
                </Typography>
                <Grid container spacing={2}>
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Other'].map((bank) => (
                    <Grid item xs={6} sm={4} key={bank}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ py: 2 }}
                      >
                        {bank}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* UPI */}
            {paymentMethod === 'upi' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Enter UPI ID
                </Typography>
                <TextField
                  fullWidth
                  label="UPI ID"
                  placeholder="yourname@upi"
                  helperText="e.g., 9876543210@paytm or yourname@upi"
                />
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption">
                🔒 Your payment information is secure and encrypted
              </Typography>
            </Alert>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePayment}
              disabled={processing}
              sx={{ mt: 3 }}
            >
              {processing ? 'Processing...' : `Pay ₹${(amount * 1.2).toFixed(2)}`}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const FeeCalculator = ({ programType, category }) => {
  const baseFees = {
    undergraduate: 50000,
    postgraduate: 75000,
    phd: 30000,
  };

  const categoryDiscount = {
    general: 0,
    obc: 0.1,
    sc: 0.5,
    st: 0.5,
  };

  const baseFee = baseFees[programType] || 50000;
  const discount = categoryDiscount[category] || 0;
  const discountAmount = baseFee * discount;
  const finalFee = baseFee - discountAmount;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Fee Calculator
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Base Tuition Fee</Typography>
          <Typography variant="body2">₹{baseFee.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Category Discount ({(discount * 100).toFixed(0)}%)</Typography>
          <Typography variant="body2" color="success.main">
            -₹{discountAmount.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Hostel Fee (Optional)</Typography>
          <Typography variant="body2">₹20,000</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Library Fee</Typography>
          <Typography variant="body2">₹5,000</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total Annual Fee</Typography>
          <Typography variant="h6" color="primary">
            ₹{(finalFee + 25000).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const PaymentHistory = () => {
  const transactions = [
    { id: 'TXN001', date: '2024-01-15', amount: 5000, status: 'completed', type: 'Application Fee' },
    { id: 'TXN002', date: '2024-02-01', amount: 50000, status: 'completed', type: 'Semester Fee' },
    { id: 'TXN003', date: '2024-02-15', amount: 10000, status: 'pending', type: 'Exam Fee' },
  ];

  const [receiptDialog, setReceiptDialog] = useState(null);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell>{txn.id}</TableCell>
                <TableCell>{txn.date}</TableCell>
                <TableCell>{txn.type}</TableCell>
                <TableCell>₹{txn.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={txn.status}
                    color={txn.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setReceiptDialog(txn)}
                    disabled={txn.status !== 'completed'}
                  >
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Receipt Dialog */}
      <Dialog open={!!receiptDialog} onClose={() => setReceiptDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogContent>
          {receiptDialog && (
            <Box>
              <Typography variant="body2"><strong>Transaction ID:</strong> {receiptDialog.id}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {receiptDialog.date}</Typography>
              <Typography variant="body2"><strong>Type:</strong> {receiptDialog.type}</Typography>
              <Typography variant="body2"><strong>Amount:</strong> ₹{receiptDialog.amount}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {receiptDialog.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialog(null)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { PaymentInterface, FeeCalculator, PaymentHistory };
