import { config } from 'dotenv';

import { setupDb } from './startup/db';
import { app } from './app';

config();
setupDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
