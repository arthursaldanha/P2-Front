export class Produto {
  public nome: string = "";
  public qtdeEstoque: number = 0;
  public preco: number = 0;
  private _idFornFK: number | null = null;

  constructor(
    nome: string = "",
    qtdeEstoque: number = 0,
    preco: number = 0,
    _idFornFK: number | null = null
  ) {
    nome = nome;
    qtdeEstoque = qtdeEstoque;
    preco = preco;
    _idFornFK = _idFornFK;
  }

  public get idFornFK() {
    return this._idFornFK;
  }

  public set idFornFK(value: number | null) {
    this._idFornFK = value;
  }
}
