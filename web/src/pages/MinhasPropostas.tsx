import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { FileText, CheckCircle2, XCircle, Clock, Building2, ArrowRight } from 'lucide-react';

export function MinhasPropostas() {
    const [aba, setAba] = useState<'recebidas' | 'enviadas'>('recebidas');
    const [propostas, setPropostas] = useState({ enviadas: [], recebidas: [] });
    const [loading, setLoading] = useState(true);

    const carregarPropostas = async () => {
        try {
            const response = await api.get('/propostas');
            setPropostas(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPropostas();
    }, []);

    const formatarMoeda = (valor: string) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor));
    };

    const alterarStatus = async (id: string, novoStatus: string) => {
        if (!confirm(`Tem certeza que deseja marcar como ${novoStatus}?`)) return;

        try {
            await api.patch(`/propostas/${id}/status`, { status: novoStatus });
            alert(`Proposta ${novoStatus.toLowerCase()} com sucesso!`);
            carregarPropostas(); // Recarrega a tela
        } catch (error) {
            alert('Erro ao atualizar a proposta.');
        }
    };

    if (loading) return <div className="p-8 text-[#a1a1aa]">Carregando propostas...</div>;

    const listaAtual = aba === 'recebidas' ? propostas.recebidas : propostas.enviadas;

    return (
        <div className="p-8 w-full max-w-5xl mx-auto">
            <div className="mb-8 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" /> Minhas Propostas
                </h2>
                <p className="text-[#a1a1aa]">Gerencie as negociações de compra e venda de créditos.</p>
            </div>

            {/* Tabs (Abas) */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setAba('recebidas')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${aba === 'recebidas' ? 'bg-blue-600 text-white' : 'bg-[#111111] text-[#a1a1aa] border border-white/10 hover:text-white'}`}
                >
                    Propostas Recebidas
                </button>
                <button
                    onClick={() => setAba('enviadas')}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${aba === 'enviadas' ? 'bg-blue-600 text-white' : 'bg-[#111111] text-[#a1a1aa] border border-white/10 hover:text-white'}`}
                >
                    Propostas Enviadas
                </button>
            </div>

            {/* Lista de Cards */}
            {listaAtual.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-16 text-center shadow-lg">
                    <p className="text-[#a1a1aa]">Nenhuma proposta encontrada nesta categoria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {listaAtual.map((prop: any) => (
                        <div key={prop.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">

                            {/* Informações da Proposta */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium border flex items-center gap-1 w-max
                    ${prop.status === 'EM_ANALISE' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                    ${prop.status === 'ACEITA' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                    ${prop.status === 'REJEITADA' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                  `}>
                                        {prop.status === 'EM_ANALISE' && <Clock className="w-3 h-3" />}
                                        {prop.status === 'ACEITA' && <CheckCircle2 className="w-3 h-3" />}
                                        {prop.status === 'REJEITADA' && <XCircle className="w-3 h-3" />}
                                        {prop.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-[#52525b] ml-2">Lote: {prop.lote.uf_origem}</span>
                                </div>

                                <div className="flex items-center gap-2 text-white font-medium text-lg mb-1">
                                    <Building2 className="w-5 h-5 text-[#a1a1aa]" />
                                    {aba === 'recebidas' ? prop.comprador.razao_social : prop.lote.vendedor.razao_social}
                                </div>

                                <p className="text-sm text-[#a1a1aa]">
                                    Valor Base: {formatarMoeda(prop.lote.valor_face)} • Deságio Oferecido: <strong className="text-blue-400">{prop.desagio_oferecido}%</strong>
                                </p>
                            </div>

                            {/* Valores Finais e Ações */}
                            <div className="flex flex-col md:items-end gap-4">
                                <div className="text-left md:text-right bg-[#111111] border border-white/5 p-3 rounded-lg w-full md:w-auto">
                                    <p className="text-xs text-[#a1a1aa] mb-1">Valor a ser Pago (Líquido)</p>
                                    <p className="text-xl font-bold text-green-400">{formatarMoeda(prop.valor_final)}</p>
                                </div>

                                {aba === 'recebidas' && prop.status === 'EM_ANALISE' && (
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <button
                                            onClick={() => alterarStatus(prop.id, 'REJEITADA')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-[#111111] text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium"
                                        >
                                            Rejeitar
                                        </button>
                                        <button
                                            onClick={() => alterarStatus(prop.id, 'ACEITA')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                        >
                                            Aceitar Proposta <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}