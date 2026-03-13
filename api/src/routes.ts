import { Router } from 'express'
import { prisma } from './prisma'

export const routes = Router()

// Rota: Criar um novo lote de ICMS (Entrada de Estoque)
routes.post('/lotes', async (req, res) => {
    try {
        const { empresa_id, uf_origem, valor_face, desagio_sugerido } = req.body

        // Validação básica
        if (!empresa_id || !uf_origem || !valor_face || !desagio_sugerido) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
        }

        // Criação do lote no banco
        const novoLote = await prisma.loteCredito.create({
            data: {
                empresa_id,
                uf_origem,
                valor_face,
                desagio_sugerido,
            },
        })

        return res.status(201).json(novoLote)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro interno ao criar o lote.' })
    }
})

// Rota: Listar lotes disponíveis (Para a Vitrine do Frontend)
routes.get('/lotes', async (req, res) => {
    try {
        const lotes = await prisma.loteCredito.findMany({
            where: { status: 'DISPONIVEL' },
            include: {
                vendedor: {
                    select: { razao_social: true, uf: true }
                }
            }
        })

        return res.json(lotes)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao buscar lotes.' })
    }
})