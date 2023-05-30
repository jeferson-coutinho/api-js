const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
port = 3001;

// Configuração do BD MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso');
    // Trecho utilizado para inserção de dados da plataforma
    // createPlatforms();
  }).catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

// Definição do modelo de dados
const GamesSchema = new mongoose.Schema({
  nameGame: String,
  linkImage: String,
  platform: Number,
})

const PlatformSchema = new mongoose.Schema({
  platformNumber: {
    type: Number,
    unique: true
  },
  name: String
})

// Cria o modelo das coleções Games e Platform
const Games = mongoose.model('Games', GamesSchema);
const Platform = mongoose.model('Platform', PlatformSchema);

// Configuração do middleware para lidar com JSON
app.use(express.json());

// Habilitar o CORS para todas as origens
app.use(cors());

// Adicionar as plataformas na coleção
// const createPlatforms = async () => {
//   try {
// Criar os documentos das plataformas
//     const playstation = new Platform({
//       platformNumber: 1,
//       name: 'Playstation'
//     });

//     const xbox = new Platform({
//       platformNumber: 2,
//       name: 'Xbox'
//     });

//     const nintendo = new Platform({
//       platformNumber: 3,
//       name: 'Nintendo'
//     });

// Salvar os documentos no MongoDB
//     await playstation.save();
//     await xbox.save();
//     await nintendo.save();

//     console.log('Plataformas adicionadas com sucesso!');
//   } catch (error) {
//     console.error('Erro ao adicionar as plataformas:', error);
//   }
// };

// Rotas API
// Pega todos os jogos
app.get('/games', async (req, res) => {
  try {
    const game = await Games.find();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

// Pega um jogo pela ID
app.get('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Games.findById(id);

    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

// Cria um novo jogo
app.post('/games', async (req, res) => {
  try {
    const { nameGame, linkImage, platform } = req.body;
    const games = new Games({ nameGame, linkImage, platform });
    await games.save();
    res.status(201).json(games);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar um novo registro' });
  }
});

// Atualiza um jogo
app.put('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nameGame, linkImage, platform } = req.body;
    const game = await Games.findByIdAndUpdate(id, { nameGame, linkImage, platform }, { new: true });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o resgistro' });
  }
});

// Delata um jogo
app.delete('/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Games.findByIdAndRemove(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o registro' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
