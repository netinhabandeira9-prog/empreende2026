
import { BlogPost } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Guia Completo: Como se adequar ao DET (Domicílio Eletrônico Trabalhista) em 2026",
    excerpt: "Não é apenas um cadastro. O DET é agora o único canal de fiscalização. Aprenda o passo a passo para não ser multado.",
    category: "Obrigatoriedade",
    date: "22 Mai 2026",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    author: "Dr. Ricardo Mendes - Consultor Jurídico",
    readTime: "12 min",
    isUrgent: true,
    content: `
      O Domicílio Eletrônico Trabalhista (DET) deixou de ser opcional e tornou-se a espinha dorsal da comunicação entre o Ministério do Trabalho e o empreendedor brasileiro, incluindo o MEI. 

      ### Por que isso é vital em 2026?
      A partir deste ano, a fiscalização não envia mais cartas físicas. Se você receber uma intimação pelo DET e não visualizar, o prazo correrá normalmente, resultando em multas automáticas que podem variar de R$ 400 a R$ 4.000 para pequenas infrações.

      ### Passo a Passo para Regularização:
      1. **Acesso ao Portal:** Utilize sua conta Gov.br (nível Prata ou Ouro).
      2. **Atualização de Contatos:** O erro mais comum é não cadastrar um e-mail ativo. O sistema exige um e-mail de alerta.
      3. **Procuração Eletrônica:** Se você tem um contador, deve outorgar poderes específicos para que ele monitore o DET por você.
      4. **Verificação de Pendências:** Verifique a aba "Notificações". Mensagens lidas são marcadas com data/hora, o que inicia contagens de prazos de defesa.

      **Dica de Especialista:** Verifique o DET pelo menos uma vez por semana. Configure um alerta no seu calendário. O silêncio do DET é, muitas vezes, o prelúdio de uma multa por omissão.
    `
  },
  {
    id: 2,
    title: "Entenda a Transição do IBS e CBS: O fim do ISS e ICMS para o Autônomo",
    excerpt: "2026 é o ano da virada. Entenda como a alíquota de transição impacta sua precificação e a nova Guia Única.",
    category: "Legislação",
    date: "15 Mai 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    author: "Ana Clara Rocha - Economista",
    readTime: "15 min",
    isFeatured: true,
    content: `
      A Reforma Tributária finalmente chegou à sua fase prática em 2026. O sistema que conhecíamos como "complexo" está sendo substituído pelo IVA Dual (IBS e CBS).

      ### O que mudou hoje?
      O ISS (municipal) e o ICMS (estadual) estão sendo fundidos no **IBS (Imposto sobre Bens e Serviços)**. Simultaneamente, o PIS e a COFINS deram lugar à **CBS (Contribuição sobre Bens e Serviços)**.

      ### Impacto direto no seu bolso:
      Para o MEI, a boa notícia é a manutenção do Simples Nacional, mas o cálculo da parcela destinada ao IBS/CBS foi reajustado. 
      
      *   **Alíquota de Transição:** Em 2026, operamos com uma alíquota teste de 1%. 
      *   **Crédito Tributário:** Pela primeira vez, o autônomo que compra insumos poderá abater o imposto pago na compra do imposto devido na venda. 

      ### Como se preparar:
      Você deve revisar sua planilha de custos imediatamente. O imposto agora é "por fora", ou seja, ele não incide sobre si mesmo. Se você não ajustar seu markup, terá uma perda de margem de até 4% já neste primeiro semestre.

      **Atenção:** Guarde todas as notas fiscais de compras de equipamentos. Elas valem dinheiro (crédito) no novo regime.
    `
  },
  {
    id: 3,
    title: "Domine a Nova NFS-e Nacional: Adeus Portais Municipais",
    excerpt: "O padrão nacional é obrigatório. Veja como configurar seu emissor e evitar erros comuns de preenchimento.",
    category: "Gestão",
    date: "14 Mai 2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    author: "Equipe Técnica Empreende",
    readTime: "10 min",
    content: `
      Acabou a confusão de cada cidade ter um site diferente. O Emissor Público Nacional de Nota Fiscal de Serviço Eletrônica é agora a única via para o MEI.

      ### Configuração Inicial (Checklist):
      *   **Senha Web:** Utilize a mesma senha do Portal do Empreendedor.
      *   **Configuração de Favoritos:** Cadastre seus serviços mais comuns (códigos LC 116) para ganhar tempo.
      *   **Dados do Tomador:** Em 2026, o sistema valida o CPF/CNPJ em tempo real com a Receita Federal.

      ### O Erro que mais Gera Multas:
      Muitos empreendedores estão emitindo notas como "Prestação de Serviço" para vendas de produtos. Isso gera uma bitributação desnecessária e atrai o fisco estadual. 

      **Como corrigir:** Se você vende produtos, deve emitir NF-e (DANFE) e não NFS-e. A NFS-e é estritamente para capital intelectual ou mão de obra.

      **Dica de Ouro:** O aplicativo móvel da NFS-e Nacional agora permite emissão offline. Se você trabalha em locais sem sinal, pode gerar o rascunho e o sistema transmite assim que houver conexão, garantindo que você nunca entregue um serviço sem nota.
    `
  }
];

export const TAX_RATES_2026 = {
  MINIMUM_WAGE: 1640.00, 
  MEI_LIMIT_MONTHLY: 10000.00,
  MEI_BASE_PERCENT: 0.05,
  EMPLOYEE_INSS_PATRONAL: 0.03,
  EMPLOYEE_FGTS: 0.08,
  // Alíquotas de TESTE para transição 2026
  CBS_RATE: 0.009, 
  IBS_RATE: 0.001,
  SIMPLES_NACIONAL_START: 0.06
};
