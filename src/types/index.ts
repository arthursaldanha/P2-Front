export interface IGetProdutos {
  _idFornFK?: number | null;
  _id?: number;
  nome: string;
  qtdeEstoque: number;
  preco: number;
}

export interface IGetFornecedores {
  _id?: number;
  nome: string;
}