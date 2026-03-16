import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// 1. Setup for ES Modules (to handle file paths correctly)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Use the Port provided by Railway (defaults to 5000 locally)
const PORT = process.env.PORT || 5000;

// 3. Middlewares
app.use(express.json());

// 4. API Route (The test route you had before)
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the Backend!" });
});

// 5. SERVE THE FRONTEND
// This tells Express to look into the 'dist' folder (which Vite creates)
app.use(express.static(path.join(__dirname, 'dist')));

// 6. THE CATCH-ALL ROUTE
// If someone types in a URL like /about, this tells the browser 
// to let the React Router handle it instead of crashing.
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});