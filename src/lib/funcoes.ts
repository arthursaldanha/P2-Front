
import {question, keyInSelect, keyInYN} from 'readline-sync';
import axios from 'axios';
import {Produto} from '../classes/produto';
import {Fornecedor} from '../classes/fornecedor';
import { IGetFornecedores, IGetProdutos } from '../types';

export async function listarFornecedores() {
  console.log('------------------------------');
  console.log(' FORNECEDORES');
  console.log('------------------------------');
  console.log('ID NOME');
  console.log('------------------------------');

  try {
    await axios.get<Array<IGetFornecedores>>('http://localhost:3000/fornecedores').then((result) => { 
      result.data.forEach(({ _id, nome }) => console.log(_id + ' - ' + nome)) 
    });
    console.log('------------------------------');
  } catch (error) {
    console.log('ERRO: ' + error);
  }
}

export async function listarProdutosComFornecedores() {
  // Lista fornecedores cadastrados
  console.log('--------------------------------------------');
  console.log(' PRODUTOS COM FORNECEDORES');
  console.log('--------------------------------------------');
  console.log(' PRODUTO');
  console.log('ID - NOME (NOME FORNECEDOR)');
  console.log('--------------------------------------------');

  await Promise.all([
    axios.get<Array<IGetProdutos>>('http://localhost:3000/produtos'),
    axios.get<Array<IGetFornecedores>>('http://localhost:3000/fornecedores')
  ])
    .then((results) => {
      const produtos = results[0].data; // Array de produtos
      const fornecedores = results[1].data; // Array de fornecedores
      const fornecedor = fornecedores.find(elemento => elemento._id === id);
      
      let produtosComFornecedor = results[0].data.map((elemProduto) =>
      ({ _id: elemProduto._id,
      nome: elemProduto.nome,
      qtdeEstoque: elemProduto.qtdeEstoque,
      preco: elemProduto.preco,
      _idFornFK: elemProduto._idFornFK, 
      nomeForn: fornecedores?.find(elemForn => elemForn?._id === elemProduto?._idFornFK).nome
      }));
      produtosComFornecedor.forEach((elemento) => {
        console.log(`${elemento._id} - ${elemento.nome}(${elemento.nomeForn})`);
      });
      console.log('--------------------------------------------');
    })
    .catch((error) => console.log('ERRO: ' + error));
}

export async function adicionarProduto() {
  const nome = question('Digite o nome do produto: ');
  const qtdeEstoque = parseInt(question('Digite a quantidade em estoque: '));
  const preco = parseFloat(question('Digite o preço: '));

  const produto = new Produto(nome, qtdeEstoque, preco);

  try {
    await axios.get<Array<IGetFornecedores>>('http://localhost:3000/fornecedores')
    .then((result) => { 
      const vetFornecedores = result.data.map((elemForn) => elemForn.nome) 
      console.log('Selecione abaixo o fornecedor para o produto:')
      const opcao = Number(keyInSelect(vetFornecedores, 'Digite a opção : ', { cancel: 'null' }));
      produto.idFornFK = opcao >= 0 ? opcao + 1 : null;
      console.log(`Fornecedor selecionado: ${produto.idFornFK}${produto.idFornFK ? '-' + vetFornecedores[produto.idFornFK - 1] : ''}`);
    });

    // Cadastra o produto
    await axios.post('http://localhost:3000/produtos', produto)
      .then((result) => console.log(result.data.message))
  } 
    catch (error) {
    console.log('ERRO: ' + error);
  }
}

// _____________________________________________________________________________________
export async function listarEditarProdutos() {
  // Lista produtos cadastrados
  console.log('Selecione abaixo o produto para Alterar/Excluir:')

  try {
    let opcao: number | undefined = undefined;
    let produtoId: number | null = null
    let produto: IGetProdutos | undefined = undefined;

    await axios.get<Array<IGetProdutos>>('http://localhost:3000/produtos').then((result) => {
      const vetProdutos = result.data.map(({ _id, nome }) => `-> ${_id} - ${nome}`)
      console.log('----------------------------------');
      console.log(' PRODUTOS');
      console.log('----------------------------------');
      console.log('[ ] ID NOME');
      console.log('----------------------------------');
      opcao = Number(keyInSelect(vetProdutos, 'Digite a opção: ', { cancel: 'Sair' }));
      produtoId = opcao >= 0 ? opcao + 1 : null;
      //console.clear();
    });

    if (opcao !== -1) {
      console.clear();

      await axios.get<IGetProdutos>(`http://localhost:3000/produtos/${produtoId}`).then(result => {
        produto = result.data;

        console.log('-----------------------------------');
        console.log(' DETALHE DO PRODUTO');
        console.log('-----------------------------------');
        console.log(`ID: ${result.data._id}`);
        console.log(`NOME: ${result.data.nome}`);
        console.log(`QTDE: ${result.data.qtdeEstoque} PREÇO: ${result.data.preco} ID_FORN: ${result.data._idFornFK}`);
        console.log('-----------------------------------');
      });

      opcao = Number(keyInSelect(['Alterar', 'Excluir'], 'Digite a opção: ', { cancel: 'Sair' }));

      switch (opcao) {
        case 0:
          const nome = question('NOME: ');
          const qtdeEstoque = parseInt(question('QTDE ESTOQUE: ')); 
          const preco = parseFloat(question('PREÇO: '));
          const idFornFK = parseInt(question('ID FORNECEDOR: '));

          const produto = new Produto(nome, qtdeEstoque, preco, idFornFK, )
          
          await axios.put(`http://localhost:3000/produtos/${produto._id}`, produto).then((result) => console.log(result.data.message));
        break;
        
        case 1: // Excluir
          const excluir = keyInYN(`Deseja excluir o produto "${produto._id}-${produto.nome}" (y=sim / n=não)?`)
          if (excluir) await axios.delete(`http://localhost:3000/produtos/${produto._id}`).then((result) => console.log(result.data.message));
        break;

        case -1:
          console.log('Operação de "Alteração/Exclusão" CANCELADA!');
        break;
      }
    } else { 
      console.log('Operação de "Alteração/Exclusão" CANCELADA!') 
    } 
  } catch (error) {
    console.log('ERRO: ' + error);
  }
}
