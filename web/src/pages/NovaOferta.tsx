import { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { FilePlus, MapPin, DollarSign, Percent, ArrowRight, Loader2, UploadCloud } from 'lucide-react';

export function NovaOferta() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [ufOrigem, setUfOrigem] = useState('');
    const [valorFace, setValorFace] = useState('');
    const [desagioSugerido, setDesagioSugerido] = useState('');
    const [arquivo, setArquivo] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!arquivo) {
            return alert('Você precisa anexar o documento de Homologação da SEFAZ.');
        }

        setLoading(true);

        try {
            // Quando tem arquivo envolvido, precisamos empacotar como FormData
            const formData = new FormData();
            formData.append('uf_origem', ufOrigem);
            formData.append('valor_face', valorFace);
            formData.append('desagio_sugerido', desagioSugerido);
            formData.append('documento', arquivo); // Aqui vai o PDF

            // O axios entende automaticamente que é um multipart/form-data
            await api.post('/lotes', formData);

            alert('Lote e Documentação enviados com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || 'Erro ao processar o arquivo.';
            alert(`Falha ao cadastrar: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 w-full max-w-3xl mx-auto">
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                    <FilePlus className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1 text-white">Vender Crédito Homologado</h2>
                    <p className="text-[#a1a1aa]">Apenas créditos auditados e com despacho da SEFAZ.</p>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Estado de Origem (UF)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input type="text" maxLength={2} required value={ufOrigem} onChange={(e) => setUfOrigem(e.target.value.toUpperCase())}
                                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 transition-all uppercase placeholder:text-[#52525b]" placeholder="Ex: SP" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Deságio Sugerido (%)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Percent className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input type="number" step="0.01" required value={desagioSugerido} onChange={(e) => setDesagioSugerido(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]" placeholder="Ex: 15.50" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Valor de Face do Crédito (R$)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-[#52525b]" />
                                </div>
                                <input type="number" step="0.01" required value={valorFace} onChange={(e) => setValorFace(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 text-white text-lg font-semibold rounded-lg pl-10 pr-4 py-4 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-[#52525b]" placeholder="1000000.00" />
                            </div>
                        </div>
                    </div>

                    {/* ÁREA DE UPLOAD DA SEFAZ */}
                    <div className="mt-6 border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors bg-[#111111]">
                        <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                        <p className="text-white font-medium mb-1">Upload do Certificado da SEFAZ</p>
                        <p className="text-xs text-[#a1a1aa] mb-4">Anexe o PDF ou imagem do despacho oficial de homologação do crédito.</p>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-[#a1a1aa] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all mt-8 shadow-lg shadow-blue-600/20 disabled:opacity-70">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando e Salvando Documento...</> : <>Enviar para Auditoria e Publicar <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}