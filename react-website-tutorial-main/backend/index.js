const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Cloud MongoDB Connection 1 (New Cloud Database replacing local)
const cloudUri1 = 'mongodb+srv://meerajakn:wPwjx8BzM0DuvAzg@cluster.1jqwmjg.mongodb.net/?retryWrites=true&w=majority';

const cloudConnection1 = mongoose.createConnection(cloudUri1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

cloudConnection1.on('error', console.error.bind(console, 'Cloud MongoDB connection 1 error:'));
cloudConnection1.once('open', () => {
  console.log('Connected to Cloud MongoDB');
});

// Cloud MongoDB Connection 2 (Existing Cloud Database)
const password = encodeURIComponent('LcDL6n?&8RzY$kgJ'); // Replace with your actual password
const cloudUri2 = `mongodb+srv://mongo:${password}@cluster0.wccrmo0.mongodb.net/netflix_dummy_server?retryWrites=true&w=majority`;

const cloudConnection2 = mongoose.createConnection(cloudUri2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

cloudConnection2.on('error', console.error.bind(console, 'Cloud MongoDB connection 2 error:'));
cloudConnection2.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define MongoDB Schemas and Models
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  country: {type: String, default: ''},
  age: String,
  creditCard: { type: Number, default: '' },
  validTill: { type: String, default: '' },
  ccv: { type: Number, default: '' },
  subscriptionDays: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  isCert: { type: Boolean, default: false },
});

const CloudContact1 = cloudConnection1.model('contacts', ContactSchema);

// Define MongoDB Schemas and Models for CSR
const CSRSchema = new mongoose.Schema({
  username: { type: String, required: true },
  csrPath: { type: String, required: true },
  keyPath: { type: String, required: true },
  organization: { type: String, default: 'Cinezo' },
  subscriptionDays: { type: Number },
  country: { type: String},
  status: { type: String, default: 'Pending' },
  publicKey: { type: String, required: true },
}, { collection: 'cloud_csr_info' });

const CloudCSR1 = cloudConnection1.model('cloud_csr_info', CSRSchema);
const CloudCSR2 = cloudConnection2.model('cloud_csr_info', CSRSchema);

// Define MongoDB Schemas and Models for CSR details
const CSRDetailSchema = new mongoose.Schema({
  username: { type: String, required: true },
  csrContent: { type: String, required: true },
  keyContent: { type: String, required: true },
  pubKeyContent: { type: String},
}, { collection: 'csr_details' });

const CloudCSRDetail = cloudConnection1.model('csr_details', CSRDetailSchema);

// Function to create a CSR using OpenSSL with additional details
const createCSR = (email, organization, subscriptionDays, country) => {
  console.log(`Creating CSR for: ${email}, Organization: ${organization}, SubscriptionDays: ${subscriptionDays}, Country: ${country}`);
  const csrPath = path.join(__dirname, 'csr_details', `${email}.csr`);
  const keyPath = path.join(__dirname, 'csr_details', `${email}.key`);
  const publicKeyPath = path.join(__dirname, 'csr_details', `${email}.pubkey`);
  const csrCommand = `openssl req -new -newkey rsa:2048 -nodes -keyout ${keyPath} -out ${csrPath} -subj "/C=US/ST=State/L=City/O=${organization}/OU=Unit/CN=${email}/subscriptionDays=${subscriptionDays}/country=${country}"`;

  exec(csrCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating CSR for ${email}:`, error);
      return;
    }
    console.log(`CSR created for ${email}:\n`, stdout);

    // Extract public key from the newly generated CSR
    const publicKeyCommand = `openssl req -in ${csrPath} -pubkey -noout`;

    exec(publicKeyCommand, async (pubKeyError, pubKeyStdout, pubKeyStderr) => {
      if (pubKeyError) {
        console.error(`Error extracting public key for ${email}:`, pubKeyError);
        return;
      }

      // Extracted public key
      const publicKey = pubKeyStdout.trim();
      console.log(`Public key extracted for ${email}\n`);

      fs.writeFile(publicKeyPath, publicKey, err => {
        if (err) {
          console.error('Error saving Public Key locally:', err);
        } else {
          console.log('Public Key saved locally.');
        }
      });

      // Save CSR details to both cloud databases
      const newCloudCSR1 = new CloudCSR1({ username: email, csrPath, keyPath, organization, subscriptionDays, country, publicKey });
      const newCloudCSR2 = new CloudCSR2({ username: email, csrPath, keyPath, organization, subscriptionDays, country, publicKey });

      try {
        await newCloudCSR1.save();
        await newCloudCSR2.save();
        console.log('CSR details saved to databases successfully.');

        // Also save CSR locally
        fs.writeFile(csrPath, stdout, err => {
          if (err) {
            console.error('Error saving CSR locally:', err);
          } else {
            console.log('CSR saved locally.');
          }
        });

        fs.writeFile(keyPath, '', err => {  // Assuming key is not stored locally
          if (err) {
            console.error('Error saving Key locally:', err);
          } else {
            console.log('Key saved locally.');
          }
        });

        // Read CSR and Key files content
        const csrContent = fs.readFileSync(csrPath, 'utf8');
        const keyContent = fs.readFileSync(keyPath, 'utf8');
        const pubKeyContent = fs.readFileSync(publicKeyPath, 'utf8');

        // Save CSR details including file content to cloud database 1
        const newCloudCSRDetail = new CloudCSRDetail({ username: email, csrContent, keyContent, pubKeyContent });
        await newCloudCSRDetail.save();
        console.log('CSR files saved to csr_details collection in Cloud MongoDB 1.');

      } catch (err) {
        console.error('Error saving CSR details:', err);
      }
    });
  });
};
// Routes
app.post('/api/register', async (req, res) => {
  const { name, email, password, gender, country, age } = req.body;
  try {
    const existingContact = await CloudContact1.findOne({ email });
    if (existingContact) {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    const newContact = new CloudContact1({ name, email, password, gender, country, age });
    await newContact.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register contact' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const contact = await CloudContact1.findOne({ email, password });
    if (!contact) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }
    if (!contact.isPaid) {
      return res.status(200).json({ message: 'Login successful, but subscription not paid', isPaid: false });
    }
    res.status(200).json({ message: 'Login successful', isPaid: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Endpoint to check if the email has already made a payment
app.post('/api/check-payment', async (req, res) => {
  const { email } = req.body;
  try {
    const contact = await CloudContact1.findOne({ email });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    if (contact.isPaid) {
      return res.status(200).json({ message: 'Payment already made' });
    }
    res.status(200).json({ isPaid: contact.isPaid });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Endpoint to handle payment
app.post('/api/payment', async (req, res) => {
  const { email, creditCard, validTill, ccv, subscriptionDays } = req.body;
  try {
    const cloudContact1 = await CloudContact1.findOne({ email });

    if (!cloudContact1) {
      return res.status(404).json({ error: 'Contact not found in one of the databases' });
    }

    if (cloudContact1.isPaid) {
      return res.status(400).json({ error: 'Payment already made for this email' });
    }

    if (cloudContact1.subscriptionDays > 0) {
      return res.status(400).json({ error: 'You already have an ongoing subscription plan' });
    }
    const country = cloudContact1.country;
    // Assuming all validations pass, update both databases
    cloudContact1.creditCard = creditCard;
    cloudContact1.validTill = validTill;
    cloudContact1.ccv = ccv;
    cloudContact1.subscriptionDays = subscriptionDays;
    cloudContact1.isPaid = true;

    // Save both contacts
    await cloudContact1.save();

    // Create CSR for the user upon successful payment
    createCSR(cloudContact1.email, 'Cinezo', subscriptionDays, country); // Assuming 'Cinezo' is the fixed organization name

    // Respond to client after all operations complete
    res.status(200).json({ message: 'Payment information saved successfully', isPaid: true });
  } catch (err) {
    console.error('Payment process failed:', err);
    res.status(500).json({ error: 'Failed to save payment information' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});