import PocketBase from 'pocketbase';

// Switch between local and production:
// Local:      http://127.0.0.1:8090
// Production: https://your-railway-url.up.railway.app
const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';

const pb = new PocketBase(PB_URL);

export default pb;
