import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Building2, MapPin, Tag, ArrowRight, Loader2, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Lote {
    id: string;
    empresa_id: string;
    uf_origem: string;
    valor_face: string;
    desagio_sugerido: string;
    arquivo_homologacao: string;
    vendedor: {
        razao_social: string;
        uf: string;
    };
}

export function VitrineLotes() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [ufFiltro, setUfFiltro] = useState('');
    const [loading, setLoading] = useState(true);

    const [loteSelecionado, setLoteSelecionado] = useState<Lote | null>(null);
    const [desagioOferecido, setDesagioOferecido] = useState('');
    const [loadingProposta, setLoadingProposta] = useState(false);

    const usuarioLogado = JSON.parse(localStorage.getItem('@TaxTrade:usuario') || '{}');

    const carregarLotes = async () => {
        try {
            const response = await api.get('/lotes');
            // O backend agora devolve { lotes: [...], uf_filtro: 'SP' }
            setLotes(response.data.lotes);
            setUfFiltro(response.data.uf_filtro);
        } catch (error) {
            console.error("Erro ao buscar lotes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarLotes();
    }, []);

    const formatarMoeda = (valor: string) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor));
    };

    const enviarProposta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loteSelecionado) return;

        setLoadingProposta(true);
        try {
            await api.post('/propostas', {
                lote_id: loteSelecionado.id,
                desagio_oferecido: Number(desagioOferecido)
            });

            alert('Proposta enviada com sucesso! O vendedor será notificado.');
            setLoteSelecionado(null);
            carregarLotes();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Erro ao enviar proposta.');
        } finally {
            setLoadingProposta(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-8 text-[#a1a1aa]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-8 w-full max-w-7xl mx-auto relative">

            <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Balcão de Negócios</h2>
                    <p className="text-[#a1a1aa]">Explore créditos de ICMS disponíveis e envie suas propostas.</p>
                </div>

                {/* Badge mostrando que a trava geográfica está funcionando */}
                {ufFiltro && (
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg text-sm text-blue-400 font-medium">
                        <MapPin className="w-4 h-4" />
                        Exibindo apenas créditos de {ufFiltro}
                    </div>
                )}
            </div>

            {lotes.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-16 text-center shadow-lg">
                    <CheckCircle2 className="w-12 h-12 text-[#52525b] mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Nenhum lote compatível</h3>
                    <p className="text-[#a1a1aa]">Não há créditos de ICMS disponíveis para o estado ({ufFiltro}) no momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lotes.map((lote) => {
                        const isMeuLote = lote.empresa_id === usuarioLogado.empresa_id;

                        return (
                            <div key={lote.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all group shadow-xl">

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#111111] border border-white/5 p-2 rounded-lg">
                                            <Building2 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm truncate w-32 text-white" title={lote.vendedor.razao_social}>
                                                {lote.vendedor.razao_social}
                                            </h3>
                                            <div className="flex items-center gap-1 text-xs text-green-400 mt-1 font-medium">
                                                <ShieldCheck className="w-3 h-3" /> Auditado
                                            </div>
                                        </div>
                                    </div>
                                    {isMeuLote ? (
                                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-1 rounded-full font-medium">Seu Lote</span>
                                    ) : (
                                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-1 rounded-full font-medium">Disponível</span>
                                    )}
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-xs text-[#a1a1aa] mb-1">Valor de Face</p>
                                        <p className="text-2xl font-bold text-white">{formatarMoeda(lote.valor_face)}</p>
                                    </div>

                                    <div className="flex justify-between items-center bg-[#111111] rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-[#a1a1aa]" />
                                            <span className="text-sm text-[#a1a1aa]">Deságio sugerido</span>
                                        </div>
                                        <span className="font-semibold text-blue-400">{lote.desagio_sugerido}%</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setLoteSelecionado(lote);
                                        setDesagioOferecido(lote.desagio_sugerido);
                                    }}
                                    disabled={isMeuLote}
                                    className="w-full bg-[#111111] border border-white/10 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-blue-600 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isMeuLote ? 'Este é o seu lote' : 'Fazer Proposta'}
                                    {!isMeuLote && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Proposta */}
            {loteSelecionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">

                        <button onClick={() => setLoteSelecionado(null)} className="absolute top-4 right-4 text-[#a1a1aa] hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 border-b border-white/10 bg-[#111111]">
                            <h3 className="text-lg font-bold text-white">Enviar Proposta de Compra</h3>
                            <p className="text-sm text-[#a1a1aa] mt-1">Lote de {loteSelecionado.uf_origem} • {loteSelecionado.vendedor.razao_social}</p>
                        </div>

                        <form onSubmit={enviarProposta} className="p-6 space-y-6">

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-sm text-[#a1a1aa] mb-1">Valor original do crédito</p>
                                <p className="text-xl font-bold text-blue-400">{formatarMoeda(loteSelecionado.valor_face)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#a1a1aa]">Qual deságio você quer oferecer? (%)</label>
                                <input
                                    type="number" step="0.01" required value={desagioOferecido} onChange={(e) => setDesagioOferecido(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-lg"
                                    placeholder="Ex: 18.5"
                                />
                                <p className="text-xs text-[#52525b]">O vendedor sugeriu {loteSelecionado.desagio_sugerido}%. Você pode negociar.</p>
                            </div>

                            <button type="submit" disabled={loadingProposta} className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                                {loadingProposta ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : 'Confirmar e Enviar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}