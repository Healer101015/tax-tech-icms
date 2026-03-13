import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient().$extends({
    query: {
        loteCredito: {
            // Tipamos o parâmetro desestruturado como ': any' para satisfazer o TS estrito
            async update({ args, query }: any) {
                if (args.data?.valor_face !== undefined) {
                    throw new Error(
                        "SEGURANÇA: Operação negada. O valor de face de um lote de ICMS é um estoque imutável e não pode ser editado."
                    )
                }
                return query(args)
            },
            // Fazemos o mesmo para o update em lote
            async updateMany({ args, query }: any) {
                if (args.data?.valor_face !== undefined) {
                    throw new Error(
                        "SEGURANÇA: Operação negada. O valor de face de um lote de ICMS é um estoque imutável e não pode ser editado."
                    )
                }
                return query(args)
            },
        },
    },
})