import { useState } from 'react';
import { Building2, Mail, Lock, User, FileText, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export function Registro() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cnpj: '',
        razao_social: '',
        inscricao_estadual: '',
        uf: '',
        nome: '',
        email: '',
        senha: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/registro', formData);
            alert('Cadastro realizado com sucesso! Faça seu login.');
            navigate('/login');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Erro ao registrar a empresa. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-[#ededed] flex items-center justify-center p-4 relative overflow-hidden py-12">

            {/* Efeitos de brilho de fundo (Glow) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl z-10">

                {/* Cabeçalho */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Solicitar Acesso</h1>
                    <p className="text-[#a1a1aa] text-sm mt-2">Cadastre sua empresa na TaxTrade B2B</p>
                </div>

                {/* Card do Formulário */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleRegistro} className="space-y-6">

                        {/* Seção Empresa */}
                        <div>
                            <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2 mb-4">Dados da Empresa</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">CNPJ</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-4 w-4 text-[#52525b]" />
                                        </div>
                                        <input type="text" name="cnpj" required value={formData.cnpj} onChange={handleChange}
                                            className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                            placeholder="00.000.000/0001-00" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">Razão Social</label>
                                    <input type="text" name="razao_social" required value={formData.razao_social} onChange={handleChange}
                                        className="w-full bg-[#111111] border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                        placeholder="Empresa LTDA" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">Inscrição Estadual</label>
                                    <input type="text" name="inscricao_estadual" required value={formData.inscricao_estadual} onChange={handleChange}
                                        className="w-full bg-[#111111] border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                        placeholder="123.456.789.000" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">UF (Estado)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-[#52525b]" />
                                        </div>
                                        <input type="text" name="uf" maxLength={2} required value={formData.uf} onChange={handleChange}
                                            className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-9 pr-4 py-2 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                            placeholder="SP" />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Seção Usuário Gestor */}
                        <div>
                            <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2 mb-4 mt-6">Dados do Gestor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-[#52525b]" />
                                        </div>
                                        <input type="text" name="nome" required value={formData.nome} onChange={handleChange}
                                            className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                            placeholder="João Silva" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">E-mail Corporativo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-[#52525b]" />
                                        </div>
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                            className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                            placeholder="joao@empresa.com.br" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-[#a1a1aa] ml-1">Senha de Acesso</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-[#52525b]" />
                                        </div>
                                        <input type="password" name="senha" required value={formData.senha} onChange={handleChange}
                                            className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                            placeholder="••••••••" />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Cadastrando Empresa...
                                </>
                            ) : (
                                <>
                                    Concluir Cadastro
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Link para voltar ao Login */}
                <p className="text-center text-sm text-[#a1a1aa] mt-8">
                    Já possui conta corporativa?{' '}
                    <a href="/login" className="text-white font-medium hover:text-blue-400 transition-colors">
                        Fazer login
                    </a>
                </p>
            </div>
        </div>
    );
}