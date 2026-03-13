import { useState } from 'react';
import { Building2, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/login', { email, senha });

            // Salva o token de segurança no navegador
            localStorage.setItem('@TaxTrade:token', response.data.token);
            localStorage.setItem('@TaxTrade:usuario', JSON.stringify(response.data.usuario));

            // Redireciona para o dashboard
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Erro no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-[#ededed] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Efeito de brilho de fundo sutil (Glow) */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Logo centralizada */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Entrar na TaxTrade</h1>
                    <p className="text-[#a1a1aa] text-sm mt-2">Acesse o balcão de negociação de ICMS</p>
                </div>

                {/* Card do Formulário */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">E-mail corporativo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 text-[#ededed] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-[#52525b]"
                                    placeholder="voce@empresa.com.br"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-[#a1a1aa]">Senha</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Esqueceu a senha?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 text-[#ededed] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-[#52525b]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Autenticando...
                                </>
                            ) : (
                                <>
                                    Acessar plataforma
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Link para Registro */}
                <p className="text-center text-sm text-[#a1a1aa] mt-8">
                    Sua empresa ainda não tem conta?{' '}
                    <a href="/registro" className="text-white font-medium hover:text-blue-400 transition-colors">
                        Solicitar acesso
                    </a>
                </p>
            </div>
        </div>
    );
}