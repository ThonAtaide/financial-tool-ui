const formatter = Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', });

export const formatBRLCurrency = (value) => {
    var formatted = formatter.format(value).replace(/[,]/g,'.').replace();
    return formatted;
}