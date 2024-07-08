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
  console.log('Connected to Cloud MongoDB 1');
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
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  country: { type: String, default: '' },
  age: String,
  creditCard: { type: Number, default: '' },
  validTill: { type: String, default: '' },
  ccv: { type: Number, default: '' },
  subscriptionDays: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  isCert: { type: Boolean, default: false },
});

const Contact = cloudConnection1.model('contacts', contactSchema);

const certificateSchema = new mongoose.Schema({
  commonName: { type: String, required: true },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ca_files',
    required: true,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'certificateauthorities',
    required: true,
  },
  ca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'certificateauthorities',
    required: true,
  },
  username: { type: String, required: true },
  csrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cloud_csr_info',
    required: true,
  },
  country: { type: String, required: true },
  dateAuthorized: { type: Date, default: Date.now },
  publicKey: { type: String, required: true },
  subscriptionDays: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
});

const Certificate = cloudConnection2.model('certificates', certificateSchema);

const certificateAuthoritySchema = new mongoose.Schema({
  commonName: { type: String, required: true },
  certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },  // Store ObjectId of .crt file in GridFS
  key: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },  // Store ObjectId of .key file in GridFS
  srl: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
});

const CertificateAuthority = cloudConnection2.model('certificateauthorities', certificateAuthoritySchema);

// Define MongoDB Schemas and Models for CSR
const csrSchema = new mongoose.Schema({
  username: { type: String, required: true },
  csrPath: { type: String, required: true },
  keyPath: { type: String, required: true },
  organization: { type: String, default: 'Cinezo' },
  subscriptionDays: { type: Number },
  country: { type: String },
  status: { type: String, default: 'Pending' },
  publicKey: { type: String, required: true },
}, { collection: 'cloud_csr_info' });

const CSR1 = cloudConnection1.model('cloud_csr_info', csrSchema);
const CSR2 = cloudConnection2.model('cloud_csr_info', csrSchema);

// Define MongoDB Schemas and Models for CSR details
const csrDetailSchema = new mongoose.Schema({
  username: { type: String, required: true },
  csrContent: { type: String, required: true },
  keyContent: { type: String },
  pubKeyContent: { type: String },
}, { collection: 'csr_details' });

const CSRDetail = cloudConnection1.model('csr_details', csrDetailSchema);

// Function to create a CSR using OpenSSL with additional details
const createCSR = async (email, organization, subscriptionDays, country) => {
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
      const newCSR1 = new CSR1({ username: email, csrPath, keyPath, organization, subscriptionDays, country, publicKey });
      const newCSR2 = new CSR2({ username: email, csrPath, keyPath, organization, subscriptionDays, country, publicKey });

      try {
        await newCSR1.save();
        await newCSR2.save();
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
        const newCSRDetail = new CSRDetail({ username: email, csrContent, keyContent, pubKeyContent });
        await newCSRDetail.save();
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
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(409).json({ error: 'Email is already registered', redirect: true });
    }
    const newContact = new Contact({ name, email, password, gender, country, age });
    await newContact.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register contact' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const contact = await Contact.findOne({ email, password });
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
    const contact = await Contact.findOne({ email });
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
  const { email, creditCard, validTill, ccv, subscriptionDays, organization, country } = req.body;
  try {
    const contact = await Contact.findOne({ email });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    if (contact.isPaid) {
      return res.status(400).json({ error: 'Payment already made for this email' });
    }

    if (contact.subscriptionDays > 0) {
      return res.status(400).json({ error: 'You already have an ongoing subscription plan' });
    }
    const country = contact.country;
    // Assuming all validations pass, update both databases
    contact.creditCard = creditCard;
    contact.validTill = validTill;
    contact.ccv = ccv;
    contact.subscriptionDays = subscriptionDays;
    contact.isPaid = true;

    await contact.save();

    createCSR(contact.email, 'Cinezo', subscriptionDays, country); 

    res.status(200).json({ message: 'Payment information saved successfully', isPaid: true });
  } catch (err) {
    console.error('Payment process failed:', err);
    res.status(500).json({ error: 'Failed to save payment information' });
  }
});

// Endpoint to fetch profile details
app.get('/api/profile', async (req, res) => {
  const { email } = req.query;
  try {
    const contact = await Contact.findOne({ email }, 'name email gender country age subscriptionDays');
    if (!contact) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const certificate = await Certificate.findOne({ username: email });
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Combine profile details and expiry date
    const profile = {
      ...contact.toObject(), // Convert Mongoose document to plain JavaScript object
      subscriptionExpiry: certificate.expiryDate.toISOString(),
    };


    res.status(200).json({ profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/verify-certificate', async (req, res) => {
  const { username } = req.body;
  try {
    const certificate = await Certificate.findOne({ username }).populate('issuedBy');
    if (!certificate) {
      await Contact.updateOne({ email: username }, { isCert: false });
      await CSR1.updateOne({ username }, { status: 'Pending' });
      await CSR2.updateOne({ username }, { status: 'Pending' });
      return res.status(404).json({ error: 'Certificate not found', valid: false });
    }
    const currentTime = new Date();
    if (currentTime > certificate.expiryDate) {
      await Contact.updateOne({ email: username }, { isPaid: false });
      return res.status(403).json({ error: 'Certificate has expired'});
    }

    const caName = certificate.commonName.split(' ').slice(-1)[0]; // Extract CA name from commonName
    const ca = await CertificateAuthority.findOne({ commonName: caName });
    if (!ca) {
      await Contact.updateOne({ email: username }, { isCert: false });
      await CSR1.updateOne({ username }, { status: 'Pending' });
      await CSR2.updateOne({ username }, { status: 'Pending' });
      return res.status(404).json({ error: 'Certificate authority not found' });
    }

    await Contact.updateOne({ email: username }, { isCert: true });

    // Update cloud_csr_info's status to 'Authorized' in both databases
    await CSR1.updateOne({ username }, { status: 'Authorized' });
    await CSR2.updateOne({ username }, { status: 'Authorized' });

    console.log('Certificate Authority and Certificate verified')
    res.json({ message: 'Certificate Authority and Certificate verified', valid: true, certificate });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ error: 'Authentication failed. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
