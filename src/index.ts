import { question, keyInSelect, keyInYN } from "readline-sync";

import {
  listarFornecedores,
  listarProdutosComFornecedores,
  adicionarProduto,
  listarEditarProdutos,
} from "./lib/funcoes";

const opcoesMenu = [
  "Listar Fornecedores",
  "Listar Produtos com Fornecedores",
  "Cadastrar Produto",
  "Listar/Editar Produtos",
];

async function main() {
  let sair = false;

  while (!sair) {
    console.clear();
    console.log("---------------------------------------");
    console.log(" BEM VIDO AO CONTROLE DE ESTOQUE ");
    console.log(" MENU DE OPÇÕES ");
    console.log("---------------------------------------");

    const opcao = Number(
      keyInSelect(opcoesMenu, "Digite a opção: ", { cancel: "Sair" })
    );

    switch (opcao) {
      case 0:
        console.clear();
        await listarFornecedores();
        question("...Pressione alguma tecla para continuar");
        break;

      case 1:
        console.clear();
        await listarProdutosComFornecedores();
        question("...Pressione alguma tecla para continuar");
        break;

      case 2:
        console.clear();
        await adicionarProduto();
        question("...Pressione alguma tecla para continuar");
        break;

      case 3:
        console.clear();
        await listarEditarProdutos();
        question("...Pressione alguma tecla para continuar");
        break;

      case -1:
        sair = keyInYN("Deseja sair da aplicação (y=sim /n=não)?");
        if (sair) process.exit(0);
        break;
    }
  }
}
// EXECUÇÃO DO APLICATIVO
main();
