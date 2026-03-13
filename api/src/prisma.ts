import { PrismaClient } from '@prisma/client'

// Criamos a instância do Prisma e adicionamos uma Extensão para interceptar as queries
export const prisma = new PrismaClient().$extends({
    query: {
        loteCredito: {
            // Intercepta qualquer tentativa de update em um lote
            async update({ args, query }) {
                if (args.data.valor_face !== undefined) {
                    throw new Error(
                        "SEGURANÇA: Operação negada. O valor de face de um lote de ICMS é um estoque imutável e não pode ser editado."
                    )
                }
                return query(args)
            },
            // Intercepta updates em massa
            async updateMany({ args, query }) {
                if (args.data.valor_face !== undefined) {
                    throw new Error(
                        "SEGURANÇA: Operação negada. O valor de face de um lote de ICMS é um estoque imutável e não pode ser editado."
                    )
                }
                return query(args)
            },
        },
    },
})