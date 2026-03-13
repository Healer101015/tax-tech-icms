// web/src/pages/NovaOferta.tsx
import { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { FilePlus, MapPin, DollarSign, Percent, ArrowRight } from 'lucide-react';

export function NovaOferta() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        uf_origem: '',
        valor_face: '',
        desagio_sugerido: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Mandando os dados para a nossa API (O token vai automático graças ao nosso interceptor!)
            await api.post('/lotes', {
                uf_origem: formData.uf_origem,
                valor_face: Number(formData.valor_face),
                desagio_sugerido: Number(formData.desagio_sugerido)
            });

            alert('Lote cadastrado com sucesso e já está na Vitrine!');
            navigate('/dashboard'); // Volta pra vitrine para ver o lote lá
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar o lote.');
        }
    };

    return (
        <div className="p-8 w-full max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                    <FilePlus className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1 text-white">Nova Oferta de Crédito</h2>
                    <p className="text-[#a1a1aa]">Cadastre um novo lote de ICMS homologado para venda.</p>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Estado de Origem (UF)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input type="text" maxLength={2} required
                                    value={formData.uf_origem}
                                    onChange={(e) => setFormData({ ...formData, uf_origem: e.target.value.toUpperCase() })}
                                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 transition-all uppercase placeholder:text-[#52525b]"
                                    placeholder="Ex: SP" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Deságio Sugerido (%)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Percent className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input type="number" step="0.01" required
                                    value={formData.desagio_sugerido}
                                    onChange={(e) => setFormData({ ...formData, desagio_sugerido: e.target.value })}
                                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                    placeholder="Ex: 15.50" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Valor de Face do Crédito (R$)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input type="number" step="0.01" required
                                    value={formData.valor_face}
                                    onChange={(e) => setFormData({ ...formData, valor_face: e.target.value })}
                                    className="w-full bg-[#111111] border border-white/10 text-white text-lg font-semibold rounded-lg pl-10 pr-4 py-4 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]"
                                    placeholder="1000000.00" />
                            </div>
                            <p className="text-xs text-[#52525b] ml-1 mt-2">
                                *O valor inserido será criptografado e servirá como estoque imutável base para as negociações.
                            </p>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-8 shadow-lg shadow-blue-600/20">
                        Disponibilizar Lote no Balcão
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}