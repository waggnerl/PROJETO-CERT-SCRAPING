const puppeteer = require('puppeteer');
const replaceAll = require('string.prototype.replaceall');
const axios = require('./services/axios');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); 
  //Pesquisa provedor por estado
  await page.goto('https://www.google.com/search?q=provedor+de+internet+por+estado&rlz=1C1GCEU_pt-BRBR999BR999&sxsrf=APq-WButRj8ttFbTQ4pxUhhRpAoZbAu2dw%3A1648727809220&ei=AZdFYviEDYO75OUP__6moAQ&ved=0ahUKEwi4iZnbpfD2AhWDHbkGHX-_CUQQ4dUDCA4&uact=5&oq=provedor+de+internet+por+estado&gs_lcp=Cgdnd3Mtd2l6EAM6BwgAEEcQsANKBAhBGABKBAhGGABQ9AlY9AlgoAxoAnAAeACAAaUBiAGlAZIBAzAuMZgBAKABAcgBCMABAQ&sclient=gws-wiz');
  const rankPovedor = await page.evaluate(() => {
    return {
      urlRankProvedor : document.querySelector('.w13wLe').href
    }
  });
  await page.goto(rankPovedor.urlRankProvedor);
  const rankPovedorEstado = await page.evaluate(() => {
    return {
      urlrankPovedorEstado : document.querySelector('.p402_premium tbody').innerHTML}
  });
  const tst1 = rankPovedorEstado.urlrankPovedorEstado.replaceAll('td style="height: 19px; "', '');
  const tst2 = tst1.replaceAll('tr style="height: 19px;"','')
  const tst3 = tst2.replaceAll('<','')
  const tst4 = tst3.replaceAll('>','')
  const tst5 = tst4.replaceAll('/','')
  const tst6 = tst5.replaceAll('strong','')
  const tst7 = tst6.replaceAll('"','')
  const tst8 = tst7.replaceAll('td','')
  const tst9 = tst8.replaceAll('tr','')
  const tst10 = tst9.replaceAll('style=height: 38px;','')
  const tst11 = tst10.replaceAll('style=height: 19px;','')
  const splitString = tst11.split("  ");
  let indice = splitString.indexOf('')
  
  while(indice >= 0){
    splitString.splice(indice, 1);
    indice = splitString.indexOf('');
  }


  function separar(base, max) {
    var res = [];
    
    for (var i = 4; i < base.length; i = i+(max)) {
      res.push(base.slice(i,(i+max)));
    }
    return res;
  }
  
  const data = separar(splitString, 4)
  
  const arr = []
  data.forEach(el=>{
    arr.push(el[3])
  })

   const asns = ['as266475']
   const empresas = []
   let htmlSite = ''
//Acessar ASNS
   for (let index = 0; index < arr.length; index++) {
    arr[index] = arr[index].replace(' ','')
    if (arr[index] === 'Lei Telecom'){arr[index] = 'Lci Telecom'}
    empresas.push(arr[index])
    arr[index] = arr[index].replace(' ','+')
    valor = arr[index] 
    await page.goto(`https://www.google.com/search?q=${valor}+bgp+asn&rlz=1C1GCEU_pt-BRBR999BR999&sxsrf=APq-WBtv-2EXEMXxTJSTi9XwIvaDunQC7A%3A1649247906531&ei=ooZNYqiGIPWE1sQPkLGGuA4&ved=0ahUKEwio3_Wct__2AhV1gpUCHZCYAecQ4dUDCA4&uact=5&oq=Brisanet+asn&gs_lcp=Cgdnd3Mtd2l6EAMyBAgAEB5KBAhBGABKBAhGGABQAFgAYLoGaABwAHgAgAGdAYgBnQGSAQMwLjGYAQCgAQKgAQHAAQE&sclient=gws-wiz`);
    htmlSite = await page.evaluate(() => {
      return {
       siteProvedor : document.querySelector('.LC20lb.MBeuO.DKV0Md').innerText}
    });
    //asns.push(htmlSite.siteProvedor.split(' ', 1))
  }
  //Fim Acessar ASNS

  let asnData = []
  let asnDataManip = []
  let asn = ''
  let titular = ''
  let cnpj = ''
  let pais = ''
  let email = ''
  let ips = ''
  let ipsManip = ''

  //Acessar dados ASNS
  for (let index = 0; index < asns.length; index++) {

  await page.goto(`https://registro.br/tecnologia/ferramentas/whois/?search=${asns[index]}`);
  await page.waitForSelector('.font-3 strong', {visible: true})
  await page.click('button');
  await page.screenshot({ path: 'example.png' });
  titular = await page.evaluate(() => {
    el = document.querySelector('.cell-owner')
    return el ? el.innerText : '' 
 });
 cnpj = await page.evaluate(() => {
  el = document.querySelector('.cell-ownerid')
  return el ? el.innerText : '' 
});
pais = await page.evaluate(() => {
  el = document.querySelector('.cell-country')
  return el ? el.innerText : '' 
});
email = await page.evaluate(() => {
  el = document.querySelector('.cell-emails')
  return el ? el.innerText : '' 
});
ips = await page.evaluate(() => {
  el = document.querySelector('.list ul')
  return el ? el.innerText.split('/') : '' 
});

  asn = asns[index][0]
asnDataManip = {asn: asns[index][0],titular:titular, cnpj:cnpj,pais:pais,email:email }

//try {
//  await axios.post('/data', {
//    asn: asn,
//    titular:titular,
//    cnpj:cnpj,
//    pais:pais,
//    email:email
//  
//})} catch (err) {
//  console.log(err)
//}

ipsManip = ips
for (let index = 1; index < ipsManip.length; index++) {
  ipsManip[index] = ipsManip[index].substring(2)
}
indice = ipsManip.indexOf('')
  while(indice >= 0){
    ipsManip.splice(indice, 1);
    indice = ipsManip.indexOf('');
  }

asnData.push(ipsManip)
}



//Fim acessar dados ASNS
  console.log(asnData)
 await browser.close();

})(); 

// [ '170.83.172.0', '2804:3868::' ],
//[ '187.19.128.0', '177.37.128.0', '2804:29b8::' ],
//[ '186.216.160.0', '186.216.176.0', '2804:8d4::', '191.6.96.0' ]      