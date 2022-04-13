const puppeteer = require('puppeteer');
const replaceAll = require('string.prototype.replaceall');
const axios = require('./services/axios');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); 
  //Pesquisa provedor por estado
  await page.goto('https://www.google.com/search?q=provedor+de+internet+por+estado&rlz=1C1GCEU_pt-BRBR999BR999&sxsrf=APq-WButRj8ttFbTQ4pxUhhRpAoZbAu2dw%3A1648727809220&ei=AZdFYviEDYO75OUP__6moAQ&ved=0ahUKEwi4iZnbpfD2AhWDHbkGHX-_CUQQ4dUDCA4&uact=5&oq=provedor+de+internet+por+estado&gs_lcp=Cgdnd3Mtd2l6EAM6BwgAEEcQsANKBAhBGABKBAhGGABQ9AlY9AlgoAxoAnAAeACAAaUBiAGlAZIBAzAuMZgBAKABAcgBCMABAQ&sclient=gws-wiz');
  await page.screenshot({ path: 'example.png' });

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

   const asns = []
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
    await page.screenshot({ path: 'example.png' });

    htmlSite = await page.evaluate(() => {
      return {
       siteProvedor : document.querySelector('.LC20lb.MBeuO.DKV0Md').innerText}
    });
    asns.push(htmlSite.siteProvedor.split(' ', 1))
  }
  //Fim Acessar ASNS

  let asnData = []
  let asn = ''
  let titular = ''
  let cnpj = ''
  let pais = ''
  let email = ''
  let ips = ''
  let ipsManip = ''

  //Acessar Ip por ASN
  for (let index = 0; index < asns.length; index++) {

  await page.goto(`https://registro.br/tecnologia/ferramentas/whois/?search=${asns[index]}`);
  await page.waitForSelector('.font-3 strong', {visible: true})
  await page.click('button');
  await page.screenshot({ path: 'example.png' });
  
ips = await page.evaluate(() => {
  el = document.querySelector('.list ul')
  return el ? el.innerText.split('/') : '' 
});

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
//Acessar Ip por ASN

//Limpar dados Ip

let ip = ''
let ipsArray = []
 
for (let index = 0; index < asnData.length; index++) {
  asnData[index].map(el=>{
    ipsArray.push(el)
  })
}

//Limpar dados Ip

//Consulta host por ip

let dnsArray = []
let dnsArrayFilter = []

for (let index = 0; index < ipsArray.length; index++) {
  await page.goto(`https://registro.br/tecnologia/ferramentas/whois/?search=${ipsArray[index]}`);
  await page.screenshot({ path: 'example.png' });
  await page.waitForSelector('.cell-autnum', {visible: true})

  host = await page.evaluate(() => {
    el = document.querySelector('.cell-nameservers span')
    return el ? el.innerText : '' 
 });
 
 if (host != ''){dnsArray.push(host)}
  
}
//Fim consulta host por ip

//Remover host duplicado

dnsArrayFilter = dnsArray.filter(function(el, i) {
  return dnsArray.indexOf(el) === i;
});

//Fim remover host duplicado

//Consultar dados ips


let ipMap = ''
let ipsFilter = []
for (let index = 0; index < dnsArrayFilter.length; index++) {
  ipMap = dnsArrayFilter[index]
  ipMap = ipMap.replaceAll('.',' ')
  ipMap = ipMap.split(' ')
  ipMap = [ipMap[ipMap.length-3]+'.'+ipMap[ipMap.length-2]+'.'+ipMap[ipMap.length-1]]
  await page.goto(`https://www.ssllabs.com/ssltest/analyze.html?d=${ipMap}`);
  await page.screenshot({ path: 'example.png' });
  try{
    page.waitForNavigation()
    await page.waitForTimeout(80000)
    await page.screenshot({ path: 'example.png' });

    common_name = await page.evaluate(() => {
      el = document.querySelector('table tbody :nth-child(2) .tableCell')
      return el ? el.innerText : '' 
   });
   alternatives_names = await page.evaluate(() => {
    el = document.querySelector('table tbody :nth-child(3) .tableCell')
    return el ? el.innerText : '' 
 });
 serial_number = await page.evaluate(() => {
  el = document.querySelector('table tbody :nth-child(4) :nth-child(2)')
  return el ? el.innerText : '' 
});
ipDataSend = await page.evaluate(() => {
  el = document.querySelector('.ip')
  return el ? el.innerText : '' 
});
ipDataSend = ipDataSend.replace('(', '')
ipDataSend = ipDataSend.replace(')', '')
   if(common_name != ''){
    await page.goto(`https://registro.br/tecnologia/ferramentas/whois/?search=${ipDataSend}`);
    await page.waitForTimeout(5000)
    asnDataIp = await page.evaluate(() => {
      el = document.querySelector('.cell-autnum')
      return el ? el.innerText : '' 
    });
    await page.screenshot({ path: 'example.png' });

    console.log(common_name, alternatives_names, serial_number, ipDataSend, asnDataIp)
  try {
  await axios.post('/data', {
    common_name: common_name,
    alternatives_names:alternatives_names,
    serial_number:serial_number, 
    ip: ipDataSend,
    asn:asnDataIp
})} catch (err) {
  console.log(err)
}
}
  } catch(e){
    if (e instanceof puppeteer.errors.TimeoutError) {
      console.log(e)
    }
  }  
}

//Fim consultar dados ips
  console.log(ipsFilter)
 
  await browser.close();

})(); 
