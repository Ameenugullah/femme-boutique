import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the Backend!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});