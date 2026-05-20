import { env } from "./env"
import { app } from "./app"

app.listen({
    host: '::',
    port: env.PORT
}).then(() => {
    console.log(` 🚀Server is running on port ${env.PORT}!`)
}).catch(err => {
    console.error(err)
    process.exit(1)
})