
import { Router } from 'express';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verificarToken, AuthRequest } from './middlewares/auth';

export const routes = Router();

// A CHAVE SECRETA DO SEU SISTEMA (Em produção, isso DEVE ficar no arquivo .env)
const JWT_SECRET = "tax-tech-icms-super-secret-key-2026";

// ==========================================
// ROTAS DE AUTENTICAÇÃO (LOGIN E REGISTRO)
// ==========================================

// Rota: Registrar nova Empresa e Usuário
routes.post('/registro', async (req, res) => {
    try {
        const { cnpj, razao_social, inscricao_estadual, uf, email, senha, nome } = req.body;

        // Verifica se a empresa já existe
        const empresaExiste = await prisma.empresa.findUnique({ where: { cnpj } });
        if (empresaExiste) return res.status(400).json({ error: 'CNPJ já cadastrado.' });

        // Verifica se o email já existe
        const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExiste) return res.status(400).json({ error: 'E-mail já cadastrado.' });

        // Criptografa a senha antes de salvar no banco
        const senhaHash = await bcrypt.hash(senha, 10);

        // Cria a Empresa e o Usuário na mesma transação
        const novaEmpresa = await prisma.empresa.create({
            data: {
                cnpj,
                razao_social,
                inscricao_estadual,
                uf,
                tipo: 'AMBOS', // Simplificando para o MVP
                usuarios: {
                    create: {
                        nome,
                        email,
                        senha_hash: senhaHash,
                        perfil: 'GESTOR'
                    }
                }
            },
            include: { usuarios: true } // Retorna o usuário criado junto
        });

        return res.status(201).json({ message: 'Empresa registrada com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao registrar.' });
    }
});

// Rota: Fazer Login
routes.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Busca o usuário pelo email
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas.' });

        // Compara a senha digitada com a criptografada no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas.' });

        // Gera o "Crachá" (Token JWT) com o ID do usuário e da empresa
        const token = jwt.sign(
            { id: usuario.id, empresa_id: usuario.empresa_id },
            JWT_SECRET,
            { expiresIn: '8h' } // O token expira em 8 horas
        );

        return res.json({
            token,
            usuario: { nome: usuario.nome, email: usuario.email, empresa_id: usuario.empresa_id }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// ... (Mantenha as rotas de /lotes que criamos antes logo abaixo disso) ...
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

routes.post('/lotes', verificarToken, async (req: AuthRequest, res) => {
    try {
        const { uf_origem, valor_face, desagio_sugerido } = req.body;

        // O empresa_id agora vem garantido pelo Token JWT! Ninguém pode falsificar.
        const empresa_id = req.usuario?.empresa_id;

        if (!empresa_id || !uf_origem || !valor_face || !desagio_sugerido) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const novoLote = await prisma.loteCredito.create({
            data: {
                empresa_id,
                uf_origem,
                valor_face,
                desagio_sugerido,
            },
        });

        return res.status(201).json(novoLote);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno ao criar o lote.' });
    }
});