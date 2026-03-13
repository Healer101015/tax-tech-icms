// web/src/components/VitrineLotes.tsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Building2, MapPin, Tag, ArrowRight } from 'lucide-react';

// Tipagem baseada no que retorna do nosso backend
interface Lote {
    id: string;
    uf_origem: string;
    valor_face: string; // Vem como string do banco decimal
    desagio_sugerido: string;
    vendedor: {
        razao_social: string;
        uf: string;
    };
}

export function VitrineLotes() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarLotes() {
            try {
                const response = await api.get('/lotes');
                setLotes(response.data);
            } catch (error) {
                console.error("Erro ao buscar lotes:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarLotes();
    }, []);

    // Formatador de moeda BRL
    const formatarMoeda = (valor: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(valor));
    };

    if (loading) {
        return <div className="p-8 text-textMuted flex items-center gap-3">Carregando lotes...</div>;
    }

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Balcão de Negócios</h2>
                <p className="text-textMuted">Explore créditos de ICMS disponíveis e auditados para compra.</p>
            </div>

            {lotes.length === 0 ? (
                <div className="bg-surface border border-gray-800 rounded-xl p-12 text-center text-textMuted">
                    Nenhum lote disponível no momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lotes.map((lote) => (
                        <div key={lote.id} className="bg-surface border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-all group shadow-lg">

                            {/* Cabeçalho do Card */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-800 p-2 rounded-lg">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm truncate w-32" title={lote.vendedor.razao_social}>
                                            {lote.vendedor.razao_social}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-textMuted mt-1">
                                            <MapPin className="w-3 h-3" /> Origem: {lote.uf_origem}
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-1 rounded-full font-medium">
                                    Disponível
                                </span>
                            </div>

                            {/* Valores */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-textMuted mb-1">Valor de Face</p>
                                    <p className="text-2xl font-bold">{formatarMoeda(lote.valor_face)}</p>
                                </div>

                                <div className="flex justify-between items-center bg-[#0a0a0a] rounded-lg p-3 border border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-textMuted" />
                                        <span className="text-sm text-textMuted">Deságio sugerido</span>
                                    </div>
                                    <span className="font-semibold text-primary">{lote.desagio_sugerido}%</span>
                                </div>
                            </div>

                            {/* Ação */}
                            <button className="w-full bg-gray-800 hover:bg-primary text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors group-hover:bg-primary">
                                Fazer Proposta
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}