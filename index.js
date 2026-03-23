const express = require('express')
const app = express()

app.use(express.json())

const tarefas = [
    {
        id: 1,
        titulo: "App da startup",
        descricao: "Um aplicativo que transforma listas de afazeres diários em jogos, com recompensas para aumentar o engajamento de equipes ou produtividade pessoal.",
        status: "PENDENTE"
    }
]

app.get("/tarefas", (req, res) => {
    const titulo = req.query.titulo

    if (!titulo) {
        return res.json(tarefas)
    }

    const tarefasFiltradas = tarefas.filter(t =>
        t.titulo.toLowerCase().includes(titulo.toLowerCase())
    )
    res.json(tarefasFiltradas)
})



app.post("/tarefas", function (req, res) {
    const tituloQueVeioDoCliente = req.body.titulo
    const descricaoQueVeioDoCliente = req.body.descricao
    const statusQueVeioDoCliente = req.body.status

    if (!tituloQueVeioDoCliente || !descricaoQueVeioDoCliente || !statusQueVeioDoCliente) {
        return res.status(400).json({ erro: "Título, descrição e status são obrigatórios!" })
    }

    
    const statusValidos = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]
    if (!statusValidos.includes(statusQueVeioDoCliente)) {
        
        return res.status(400).json({ erro: "Status inválido" })
    }

     const novaTarefa = {
        id: 2,
        titulo: tituloQueVeioDoCliente,
        descricao : descricaoQueVeioDoCliente,
        status : statusQueVeioDoCliente
}

    tarefas.push(novaTarefa)
    res.status(201).json(novaTarefa)
                   

})



app.get("/tarefas/:id", function (req, res) {
    const id = parseInt(req.params.id) 
    const tarefa = tarefas.find(t => t.id === id)

    if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" })
}

res.json(tarefa)
})


app.put("/tarefas/:id", function (req, res) {
    const id = parseInt(req.params.id)
    const tarefa = tarefas.find(t => t.id === id)

    if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" })
    }
    if (tarefa.status === "CONCLUIDA") {
        return res.status(400).json({ erro: "Não pode alterar uma tarefa concluída" })
    }

    const { titulo, descricao, status } = req.body

    if (titulo) tarefa.titulo = titulo
    if (descricao) tarefa.descricao = descricao

    if (status === "CONCLUIDA" && tarefa.status === "CONCLUIDA") {
        return res.status(400).json({ erro: "Tarefa já está concluída" })

        
    }
    return res.json(tarefa)
})



app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = tarefas.findIndex(t => t.id === id)

    if (index === -1) {
        return res.status(404).json({ erro: "Tarefa não encontrada" })
    }

    tarefas.splice(index, 1)

    res.status(204).send()
})
   

app.listen(3000, function (){
    console.log("Servidor rodando na porta 3000")
})


