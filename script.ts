import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class Aluno {
    constructor(public matricula: number, public nome: string, public nota: number, public grupo: any) {}
}

class Avaliador {
    constructor(public nome: string, public grupos: any[], public notas: string) {}
}

class Grupo {
    constructor(public id: number, public nome: string, public resumo: string, public nota: number, public avaliadores: Avaliador[], public integrantes: Aluno[]) {}
}

async function criarGrupo(nome: string, resumo: string, avaliadores: string[], integrantes: { matricula: number, nome: string, nota: number }[]) {
    const novoGrupo = await prisma.group.create({
        data: {
            nome,
            resumo,
            nota: 0,
            avaliador: {
                create: avaliadores.map(nome => ({
                    nome,
                    notas: 'Avaliação inicial',
                })),
            },
            integrantes: {
                upsert: integrantes.map(async aluno => {
                    const existingAluno = await prisma.aluno.findUnique({
                        where: { matricula: aluno.matricula },
                    });

                    if (existingAluno) {
                        // Aluno já existe, então atualize os dados
                        return {
                            where: { matricula: aluno.matricula },
                            update: { nome: aluno.nome, nota: aluno.nota },
                            create: { matricula: aluno.matricula, nome: aluno.nome, nota: aluno.nota },
                        };
                    } else {
                        // Aluno não existe, então crie um novo registro
                        return {
                            where: { matricula: aluno.matricula },
                            create: { matricula: aluno.matricula, nome: aluno.nome, nota: aluno.nota },
                        };
                    }
                }),
            },
        },
        include: {
            avaliador: true,
            integrantes: true,
        },
    });
    return novoGrupo;
}

async function obterTodosGrupos() {
    const grupos = await prisma.group.findMany({
        include: {
            avaliador: true,
            integrantes: true,
        },
    });
    return grupos;
}

async function main() {
    const novoGrupo = await criarGrupo('Grupo A', 'Resumo do Grupo A', ['Avaliador1', 'Avaliador2'], [
        { matricula: 1, nome: 'Aluno1', nota: 0 },
        { matricula: 2, nome: 'Aluno2', nota: 0 },
    ]);
    console.log('Novo Grupo Criado:', novoGrupo);

    const todosGrupos = await obterTodosGrupos();
    console.log('Todos os Grupos:', todosGrupos);

    // Restante do código...
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
