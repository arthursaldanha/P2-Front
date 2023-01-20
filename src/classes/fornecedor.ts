export class Fornecedor {
  public nome = "";

  constructor(nome: string = "") {
    nome = nome;
  }

  get mostrarNome() {
    return this.nome;
  }

  set mudarNome(valor: string) {
    this.nome = valor;
  }
}
