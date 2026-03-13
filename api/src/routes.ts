import { Router } from 'express';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verificarToken, AuthRequest } from './middlewares/auth';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

export const routes = Router();

const JWT_SECRET = "tax-tech-icms-super-secret-key-2026";

// ==========================================
// CONFIGURAÇÃO DE UPLOAD (MULTER)
// ==========================================
const multerConfig = multer.diskStorage({
    // Garante que o arquivo vai ser salvo na pasta 'uploads' na raiz do projeto api
    destination: path.resolve(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => {
        // Gera um código aleatório para o nome do arquivo não dar conflito
        const hash = crypto.randomBytes(8).toString('hex');
        cb(null, `${hash}-${file.originalname}`);
    }
});
const upload = multer({ storage: multerConfig });

// ==========================================
// 1. AUTENTICAÇÃO (Registro e Login)
// ==========================================

routes.post('/registro', async (req, res) => {
    try {
        const { cnpj, razao_social, inscricao_estadual, uf, email, senha, nome } = req.body;

        const empresaExiste = await prisma.empresa.findUnique({ where: { cnpj } });
        if (empresaExiste) return res.status(400).json({ error: 'CNPJ já cadastrado.' });

        const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExiste) return res.status(400).json({ error: 'E-mail já cadastrado.' });

        const senhaHash = await bcrypt.hash(senha, 10);

        const novaEmpresa = await prisma.empresa.create({
            data: {
                cnpj,
                razao_social,
                inscricao_estadual,
                uf,
                tipo: 'AMBOS',
                usuarios: {
                    create: {
                        nome,
                        email,
                        senha_hash: senhaHash,
                        perfil: 'GESTOR'
                    }
                }
            },
            include: { usuarios: true }
        });

        return res.status(201).json({ message: 'Empresa registrada com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao registrar empresa.' });
    }
});

routes.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas.' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas.' });

        const token = jwt.sign(
            { id: usuario.id, empresa_id: usuario.empresa_id },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            token,
            usuario: { nome: usuario.nome, email: usuario.email, empresa_id: usuario.empresa_id }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
});

// ==========================================
// 2. LOTES DE ICMS (Estoque e Vitrine)
// ==========================================

// Rota PROTEGIDA: Listar lotes disponíveis na Vitrine
routes.get('/lotes', verificarToken, async (req: AuthRequest, res) => {
    try {
        const lotes = await prisma.loteCredito.findMany({
            where: { status: 'DISPONIVEL' },
            include: {
                vendedor: {
                    select: { razao_social: true, uf: true }
                }
            },
            orderBy: { criado_em: 'desc' }
        });
        return res.json(lotes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar lotes na vitrine.' });
    }
});

// Rota PROTEGIDA: Criar um novo lote COM UPLOAD DO DOCUMENTO DA SEFAZ
// Adicionamos o middleware upload.single('documento') aqui
routes.post('/lotes', verificarToken, upload.single('documento'), async (req: AuthRequest, res) => {
    try {
        const { uf_origem, valor_face, desagio_sugerido } = req.body;
        const empresa_id = req.usuario?.empresa_id;

        // Pega o nome do arquivo que o multer salvou na pasta
        const arquivo_homologacao = req.file?.filename;

        console.log("📥 DADOS RECEBIDOS NA API:", { empresa_id, uf_origem, valor_face, desagio_sugerido, arquivo_homologacao });

        if (!empresa_id) {
            return res.status(400).json({ error: 'Token desatualizado. Por favor, saia da conta e faça login novamente.' });
        }
        if (!uf_origem) {
            return res.status(400).json({ error: 'O Estado de Origem (UF) está vazio.' });
        }
        if (valor_face === undefined || valor_face === null || isNaN(Number(valor_face))) {
            return res.status(400).json({ error: 'O Valor de Face não é um número válido.' });
        }
        if (desagio_sugerido === undefined || desagio_sugerido === null || isNaN(Number(desagio_sugerido))) {
            return res.status(400).json({ error: 'O Deságio Sugerido não é um número válido.' });
        }
        if (!arquivo_homologacao) {
            return res.status(400).json({ error: 'O documento de homologação da SEFAZ é obrigatório.' });
        }

        const novoLote = await prisma.loteCredito.create({
            data: {
                empresa_id,
                uf_origem,
                valor_face: Number(valor_face),
                desagio_sugerido: Number(desagio_sugerido),
                arquivo_homologacao, // Salva o nome do PDF gerado no banco
                status: 'DISPONIVEL'
            },
        });

        return res.status(201).json(novoLote);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno no banco de dados ao criar o lote com documento.' });
    }
});

// ==========================================
// 3. PROPOSTAS (Match de Compra e Venda)
// ==========================================

routes.post('/propostas', verificarToken, async (req: AuthRequest, res) => {
    try {
        const { lote_id, desagio_oferecido } = req.body;
        const comprador_id = req.usuario?.empresa_id;

        if (!comprador_id || !lote_id || !desagio_oferecido) {
            return res.status(400).json({ error: 'Faltam dados para enviar a proposta.' });
        }

        const lote = await prisma.loteCredito.findUnique({ where: { id: lote_id } });

        if (!lote) {
            return res.status(404).json({ error: 'Lote não encontrado no sistema.' });
        }

        if (lote.empresa_id === comprador_id) {
            return res.status(400).json({ error: 'Você não pode comprar seu próprio lote de ICMS.' });
        }

        const valorOriginal = Number(lote.valor_face);
        const desconto = valorOriginal * (Number(desagio_oferecido) / 100);
        const valorFinal = valorOriginal - desconto;

        const novaProposta = await prisma.proposta.create({
            data: {
                lote_id,
                comprador_id,
                desagio_oferecido,
                valor_final: valorFinal,
                status: 'EM_ANALISE'
            }
        });

        await prisma.loteCredito.update({
            where: { id: lote_id },
            data: { status: 'EM_NEGOCIACAO' }
        });

        return res.status(201).json(novaProposta);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao registrar a proposta.' });
    }
});

routes.get('/propostas', verificarToken, async (req: AuthRequest, res) => {
    try {
        const empresa_id = req.usuario?.empresa_id;

        const propostasEnviadas = await prisma.proposta.findMany({
            where: { comprador_id: empresa_id },
            include: {
                lote: {
                    include: { vendedor: { select: { razao_social: true } } }
                }
            },
            orderBy: { criado_em: 'desc' }
        });

        const propostasRecebidas = await prisma.proposta.findMany({
            where: { lote: { empresa_id: empresa_id } },
            include: {
                comprador: { select: { razao_social: true, cnpj: true } },
                lote: true
            },
            orderBy: { criado_em: 'desc' }
        });

        return res.json({ enviadas: propostasEnviadas, recebidas: propostasRecebidas });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar as propostas.' });
    }
});

routes.patch('/propostas/:id/status', verificarToken, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const empresa_id = req.usuario?.empresa_id;

        const proposta = await prisma.proposta.findUnique({
            where: { id },
            include: { lote: true }
        });

        if (!proposta || proposta.lote.empresa_id !== empresa_id) {
            return res.status(403).json({ error: 'Permissão negada. Apenas o vendedor pode aprovar.' });
        }

        const propostaAtualizada = await prisma.proposta.update({
            where: { id },
            data: { status }
        });

        if (status === 'ACEITA') {
            await prisma.loteCredito.update({
                where: { id: proposta.lote_id },
                data: { status: 'VENDIDO' }
            });
        } else if (status === 'REJEITADA') {
            await prisma.loteCredito.update({
                where: { id: proposta.lote_id },
                data: { status: 'DISPONIVEL' }
            });
        }

        return res.json(propostaAtualizada);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar o status da proposta.' });
    }
});