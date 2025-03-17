import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';

console.log("📌 Checking Schema & Resolvers");
console.log("🔍 TypeDefs:", typeDefs);
console.log("🔍 Resolvers:", JSON.stringify(resolvers, null, 2));

export { typeDefs, resolvers };

