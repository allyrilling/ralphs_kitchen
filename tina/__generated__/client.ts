import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'c0f1ecb7f50b3236708a83664c47743a1355d9f1', queries,  });
export default client;
  