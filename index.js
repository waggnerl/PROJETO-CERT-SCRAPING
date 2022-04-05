const puppeteer = require('puppeteer');
const axios = require('axios');
const replaceAll = require('string.prototype.replaceall');
var ping = require('ping');




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

  var indice = splitString.indexOf('')
  
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

   const sites = []
   const empresas = []
   let htmlSite = ''
   for (let index = 0; index < arr.length; index++) {
   arr[index] = arr[index].replace(' ','')
   if (arr[index] === 'Lei Telecom'){arr[index] = 'Lci Telecom'}
   empresas.push(arr[index])
   arr[index] = arr[index].replace(' ','+')
   let valor = arr[index] 
   if(index === 0){valor = `${arr[index]}+provedor+de+internet+acre`}
    if (index === 10) { valor = `${arr[index]}+provedor+de+internet+mato+grosso` }
   await page.goto(`https://www.google.com/search?q=${valor}&rlz=1C1GCEU_pt-BRBR999BR999&oq=vivo&aqs=chrome..69i57j46i199i291i433i512j0i433i512l2j0i131i433i512j0i433i512j69i61l2.574j0j7&sourceid=chrome&ie=UTF-8`);
   htmlSite = await page.evaluate(() => {
     return {
      siteProvedor : document.querySelector('.iUh30.tjvcx').innerHTML}
   });
  sites.push(htmlSite.siteProvedor.replace('https://',''))
 }

 

 const page2 = await browser.newPage();
 await page2.setDefaultNavigationTimeout(0); 



  let ipDataExtracted = []
  let ipData = ''
  let asn = ''

  for (let index = 0; index < sites.length; index++) {
    await page.goto(`https://ipgeolocation.io/ip-location/${sites[index]}`);  
    asn = await page.evaluate(() => {
        return {
            ip : document.querySelector('#ipaddrs').innerText
        }
        });
    await page.screenshot({ path: 'example.png' });
    await axios
    .get(`https://www.ipinfo.io/${asn.ip}?token=a712f5e7529903`)
    .then(response => ipData = response.data)
    ipDataExtracted.push(ipData)
  }
  console.log(ipDataExtracted)



  
 await browser.close();

})(); 