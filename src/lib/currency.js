import axios, * as others from 'axios'

export const getConversionRatesEUR = async() => {
    const data = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json`)
    return data.data['eur']
}

export const convertCurrency = async(amount, from, to) => {
    const data = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`)
    const priceInfo = data.data[from]
    const convertedPrice = amount * priceInfo[to]
    return convertedPrice
}


export const getFormatedPrice = (price, currency) => {
    if (Number(price) === 0) {
        return null
    }
    var formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
      
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    // const priceInUserCurrency = await convertCurrency(price, 'eur', currency.toLowerCase())
    return formatter.format(price)

}