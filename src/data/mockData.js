import CONFIG from "../config";

const { googleSheets: gs } = CONFIG;

export const MOCK = {
  faturamentoMensal: [
    { mes:"Dez", valor:3200, pedidos:41 },
    { mes:"Jan", valor:4100, pedidos:53 },
    { mes:"Fev", valor:3750, pedidos:48 },
    { mes:"Mar", valor:5200, pedidos:67 },
    { mes:"Abr", valor:4800, pedidos:62 },
    { mes:"Mai", valor:6340, pedidos:81 },
  ],
  vendasPorCategoria: [
    { nome:"Vestidos Viscolaycra", vendas:148, receita:6512 },
    { nome:"Conjuntos",            vendas:62,  receita:4650 },
    { nome:"Vestidos Moletinho",   vendas:38,  receita:2850 },
    { nome:"Blusas",               vendas:54,  receita:1890 },
    { nome:"Vestidos Lanzinha",    vendas:29,  receita:1740 },
    { nome:"Calças",               vendas:22,  receita:880  },
    { nome:"Cardigans",            vendas:18,  receita:702  },
    { nome:"Regatas",              vendas:31,  receita:620  },
    { nome:"Macacões",             vendas:14,  receita:1106 },
  ],
  topProdutos: [
    { nome:"Vestido Bella",             vendas:34, receita:1360 },
    { nome:"Conjunto Dallas",           vendas:28, receita:2100 },
    { nome:"Vestido Nina",              vendas:25, receita:2125 },
    { nome:"Vestido Pandora Moletinho", vendas:22, receita:1870 },
    { nome:"Conjunto Tiffany",          vendas:21, receita:1050 },
    { nome:"Vestido Naomi",             vendas:19, receita:1330 },
    { nome:"Blusa Julia",               vendas:18, receita:810  },
  ],
  estoqueAlertas: [
    { sku:"GAL0016", produto:"Vestido Bella",  cor:"Rosa",   tam:"P",  real:1, minimo:2, status:"baixo"    },
    { sku:"GAL0022", produto:"Vestido Nina",   cor:"Branco", tam:"M",  real:0, minimo:2, status:"esgotado" },
    { sku:"GAL0010", produto:"Conj. Tiffany", cor:"Verde",  tam:"GG", real:1, minimo:2, status:"baixo"    },
    { sku:"GAL0009", produto:"Conjunto Dani", cor:"Preto",  tam:"P",  real:0, minimo:2, status:"esgotado" },
    { sku:"GAL0019", produto:"Vestido Naomi", cor:"Vinho",  tam:"G",  real:1, minimo:2, status:"baixo"    },
    { sku:"GAL0031", produto:"Vestido Lola",  cor:"Verde",  tam:"GG", real:0, minimo:2, status:"esgotado" },
  ],
  ultimosPedidos: [
    { num:"PED-081", data:"16/05", cliente:"Mariana S.",  produto:"Vestido Bella",             cor:"Preto", tam:"M", qtd:1, total:40,  status:"Entregue"  },
    { num:"PED-080", data:"16/05", cliente:"Carla M.",    produto:"Conjunto Dallas",           cor:"Rosa",  tam:"G", qtd:1, total:75,  status:"Enviado"   },
    { num:"PED-079", data:"15/05", cliente:"Fernanda L.", produto:"Vestido Nina",              cor:"Preto", tam:"P", qtd:2, total:170, status:"Separado"  },
    { num:"PED-078", data:"15/05", cliente:"Ana P.",      produto:"Blusa Caja",                cor:"Branco",tam:"M", qtd:1, total:35,  status:"Confirmado"},
    { num:"PED-077", data:"14/05", cliente:"Juliana R.",  produto:"Vestido Pandora Moletinho", cor:"Cinza", tam:"G", qtd:1, total:85,  status:"Entregue"  },
    { num:"PED-076", data:"14/05", cliente:"Beatriz C.",  produto:"Conjunto Tiffany",          cor:"Verde", tam:"M", qtd:1, total:50,  status:"Cancelado" },
    { num:"PED-075", data:"13/05", cliente:"Sofia T.",    produto:"Cardigan Luxor",            cor:"Vinho", tam:"P", qtd:2, total:78,  status:"Entregue"  },
    { num:"PED-074", data:"13/05", cliente:"Larissa B.",  produto:"Vestido Safira",            cor:"Azul",  tam:"G", qtd:1, total:60,  status:"Entregue"  },
  ],
  distribuicaoTamanho: [
    { name:"P",  value:22 },
    { name:"M",  value:35 },
    { name:"G",  value:28 },
    { name:"GG", value:15 },
  ],
  kpis: {
    totalSkus:403, disponiveis:381, estoqueBaixo:3, esgotados:3,
    pedidosHoje:5, faturamentoHoje:375,
    pedidosMes:81, cancelados:18, emAndamento:45, entregues:289,
  },
};

export async function fetchSheetRange(range) {
  const { sheetId, apiKey } = gs;
  if (!sheetId || sheetId.includes("AQUI")) return null;
  try {
    const url  = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const res  = await fetch(url);
    const json = await res.json();
    return json.values || [];
  } catch (e) {
    console.warn("Google Sheets fetch failed:", e);
    return null;
  }
}

export function parsePedidos(rows) {
  if (!rows) return MOCK.ultimosPedidos;
  return rows.filter(r => r[0] && r[1]).slice(-20).reverse().map(r => ({
    num:     r[0] || "",
    data:    r[1] ? new Date(r[1]).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}) : "",
    cliente: r[2] || "",
    produto: r[5] || "",
    cor:     r[6] || "",
    tam:     r[7] || "",
    qtd:     Number(r[8]) || 1,
    total:   Number(r[9]) || 0,
    status:  r[10] || "Pendente",
  }));
}

export function parseAlertas(rows) {
  if (!rows) return MOCK.estoqueAlertas;
  return rows
    .filter(r => r[15] !== undefined && (Number(r[15]) <= 0 || Number(r[15]) <= Number(r[7])))
    .slice(0,12)
    .map(r => ({
      sku:    r[0]  || "",
      produto:r[2]  || "",
      cor:    r[4]  || "",
      tam:    r[5]  || "",
      real:   Number(r[15]) || 0,
      minimo: Number(r[7])  || 2,
      status: Number(r[15]) <= 0 ? "esgotado" : "baixo",
    }));
}
