// import format from "date-fns/format";

interface Dados {
  ["Status"]: string;
  ID: number;
  Data: string;
  Nome: string;
  ["Forma de Pagamento"]: string;
  Email: string;
  ["Valor (R$)"]: string;
  ["Cliente Novo"]: boolean;
}

function isDados(value: unknown): value is Dados{
  if (
    value &&
    typeof value === 'object' &&
    "Status" in value &&
    "ID" in value 

  ) {
    return true;
  } else {
    return false;
  }
}

function displayDados(dados: Dados[]) {
  if (dados && Array.isArray(dados)){
      if (isDados(dados[0])){          
          const tableElement = document.querySelector<HTMLTableElement>('table')   
          if (tableElement){
          dados.forEach(dado => {
              tableElement.innerHTML += 
                      `<tr>
                          <td>${dado.Nome}</td>
                          <td>${dado.Email}</td>
                          <td>R$ ${dado["Valor (R$)"]}</td>
                          <td>${dado["Forma de Pagamento"]}</td>
                          <td>${dado.Status}</td>    
                      </tr>`;
          })}
        }
  calcTotal(dados)
  calcTipoCompra(dados)
  calcStatusCompra(dados)
  // calcDiaMaxVendas(dados)
  } else {
    console.error('Invalid data:', dados);
  }
}

function calcTotal(dados: Dados[]){
    if (dados && Array.isArray(dados)){
        if (isDados(dados[0])){
          let totalDados = 0;       
            for (let i = 0; i < dados.length; i++) {
              
              let numeroLimpo = dados[i]["Valor (R$)"].replace('-','0').replace('.','').replace(',','.')
              if (numeroLimpo.startsWith('0') && Number(numeroLimpo) !== 0) {
                  numeroLimpo = '-' + numeroLimpo.slice(1);
              }
              totalDados += parseFloat(numeroLimpo);
            }
        const totalDadosPortugues = totalDados.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        const totalDadosElement = document.querySelector('.total-dados')
        if (totalDadosElement instanceof HTMLElement) {
          totalDadosElement.innerText = `Total: ${totalDadosPortugues}`
        }
        }
    }
}

function calcTipoCompra(dados: Dados[]){
  if (dados && Array.isArray(dados)){
      if (isDados(dados[0])){
          let boleto = 0;
          let cartao = 0;
      
          for (let i = 0; i< dados.length; i++) {
              if (dados[i]["Forma de Pagamento"] === 'Cartão de Crédito') {
                cartao += 1;
              }
              if (dados[i]["Forma de Pagamento"] === 'Boleto') {
                boleto += 1;
              }
          }

          const tipoCompraElement = document.querySelector('.tipo')
          if (tipoCompraElement instanceof HTMLElement) {
              tipoCompraElement.innerHTML = `
                  <p>Cartão: ${cartao}</p>
                  <p>Boleto: ${boleto}</p>`;
            }

      }
  }
}

function calcStatusCompra(dados: Dados[]) {
  if (dados && Array.isArray(dados)){
      if (isDados(dados[0])){
          let paga = 0;
          let recusada = 0;
          let aguardandoPgt = 0;
          let estornada = 0;
          
          for (let i = 0; i < dados.length; i++) {
            switch (dados[i]["Status"]) {
              case 'Paga':
                paga += 1;
                break;
              case 'Recusada pela operadora de cartão':
                recusada += 1;
                break;
              case 'Aguardando pagamento':
                aguardandoPgt += 1;
                break;
              case 'Estornada':
                estornada += 1;
                break;
              default:
                break;
            }
          }

          const tipoCompraElement = document.querySelector('.tipo')
          if (tipoCompraElement instanceof HTMLElement) {
              tipoCompraElement.innerHTML = `
                  <p>Pagas: ${paga}</p>
                  <p>Recusadas: ${recusada}</p>
                  <p>Aguardando pagamento: ${aguardandoPgt}</p>
                  <p>Estornadas: ${estornada}</p>`;
            }
      }
  }
}

// function calcDiaMaxVendas(dados: Dados[]){
//     if (dados && Array.isArray(dados)){
//         if (isDados(dados[0])){
//             const contagemDias = {
//               Domingo: 0,
//               Segunda: 0,
//               Terça: 0,
//               Quarta: 0,
//               Quinta: 0,
//               Sexta: 0,
//               Sabado: 0,
//             };
            
//             for (let i = 0; i < dados.length; i++) {
//                 const dataString = dados[i].Data;
//                 const data = format(new Date(dataString), 'MM/dd/yyyy');
//                 // const diaDaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' })
//                 console.log(data)
//                 console.log(dataString)
//                 console.log(diaDaSemana)
//                 contagemDias[diaDaSemana] += 1
//             } 
//           }
//     }
// }

async function fetchDados(): Promise<Dados[]> {
  const response = await fetch('https://api.origamid.dev/json/transacoes.json');
  const json: Dados[] = await response.json();
  displayDados(json);
  return json;
}

fetchDados();

