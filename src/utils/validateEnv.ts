import { 
    cleanEnv,
    str,
    port
 } from "envalid";

//  可以使用envalid来验证.env中预置的变量是否正确
export function validateEnv() {
    // cleanEnv() will log an error message and exit if any required env vars are missing or invalid.
     cleanEnv(process.env, {
        // str() - Passes string values through, will ensure an value is present unless a default value is given.
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        // port() - Ensures an env var is a TCP port (1-65535)
        PORT: port()
     })
 }