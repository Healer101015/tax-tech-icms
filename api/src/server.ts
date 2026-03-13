import express from 'express'
import cors from 'cors'
import { routes } from './routes'

const app = express()

// Middlewares essenciais
app.use(cors()) // Permite que o frontend acesse o backend
app.use(express.json()) // Faz o Express entender requisições em JSON

// Adiciona as rotas
app.use(routes)

const PORT = 3333

app.listen(PORT, () => {
    console.log(`🚀 Tax-Tech API rodando na porta ${PORT}`)
})