let plant; // Objeto planta
let truckX = -150; // Posição inicial do caminhão
let growing = false; // Flag para o crescimento da planta
let timePassed = 0; // Tempo decorrido
let weather = 'sun'; // Clima atual (sol ou chuva)
let plantHeight = 0; // Altura da planta
let plantMaxHeight = 150; // Altura máxima da planta
let rainIntensity = 0; // Intensidade da chuva
let growthRate = 0.1; // Taxa de crescimento (depende do clima)
let plantCollected = false; // Flag para saber se a planta foi coletada
let plantInCity = false; // Flag para saber se a planta chegou à cidade
let timeToTransport = 10; // Tempo para o caminhão começar a transportar a planta

function setup() {
  createCanvas(1200, 800); // Tela maior (1200x800)

  // Inicializando a planta
  plant = {
    x: width / 2, // Posição inicial da planta
    y: height - 150, // Posição inicial no chão
    size: 30, // Tamanho inicial
    color: color(34, 139, 34) // Cor inicial
  };
}

function draw() {
  background(200, 200, 255); // Cor do céu

  // Se a planta foi coletada, estamos na cidade
  if (plantInCity) {
    drawCity();
    return;
  }

  // Desenha o campo
  drawField();

  // Animações e lógica de clima (sol ou chuva)
  handleWeather();

  // Desenhando a planta
  if (!plantCollected) {
    drawPlant();
  }

  // Se passaram 10 segundos, a planta começa a crescer
  if (timePassed >= timeToTransport && !growing) {
    growing = true;
  }

  // Se a planta está crescendo, aumente sua altura
  if (growing) {
    if (weather === 'rain') {
      growthRate = 0.3; // Crescimento mais rápido com chuva
    } else {
      growthRate = 0.1; // Crescimento mais lento com sol
    }

    plantHeight += growthRate; // A planta cresce com base na taxa de crescimento

    // A planta não pode ultrapassar a altura máxima
    if (plantHeight > plantMaxHeight) {
      plantHeight = plantMaxHeight;
    }
  }

  // Se a planta estiver totalmente crescida, o caminhão começa a se mover
  if (plantHeight >= plantMaxHeight && !plantCollected) {
    moveTruckToCity();
  }

  // Atualiza o tempo decorrido
  timePassed += deltaTime / 1000; // Converte o tempo de milissegundos para segundos
}

// Função para desenhar o campo com clima
function drawField() {
  // Cor do campo (verde)
  fill(34, 139, 34);
  rect(0, height - 150, width, 150); // Desenha o campo

  // Texto inicial
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Plante e faça sua planta crescer!", width / 2, height / 4);

  // Texto do tempo decorrido
  textSize(16);
  text("Tempo: " + Math.floor(timePassed) + "s", width / 2, height / 6);
}

// Função para desenhar a planta
function drawPlant() {
  if (growing) {
    // Desenhando a planta (crescendo)
    fill(34, 139, 34); // Cor verde
    rect(plant.x - plant.size / 2, plant.y - plantHeight, plant.size, plantHeight); // Tronco

    // Desenhando as folhas
    fill(0, 255, 0); // Cor das folhas
    ellipse(plant.x, plant.y - plantHeight, plant.size * 1.5, plant.size * 1.5);
  } else {
    // Desenhando a planta inicial (pequena)
    fill(34, 139, 34); // Cor verde
    ellipse(plant.x, plant.y - 40, 30, 30); // Folhas pequenas
  }
}

// Função para lidar com o clima (sol e chuva)
function handleWeather() {
  if (weather === 'sun') {
    // Sol
    drawSun();
    rainIntensity = 0; // Não há chuva
  } else if (weather === 'rain') {
    // Chuva
    drawRain();
    rainIntensity = 1; // Intensidade da chuva
  }
}

// Função para desenhar o sol
function drawSun() {
  fill(255, 223, 0); // Cor do sol
  ellipse(width - 100, 100, 100, 100); // Desenha o sol
}

// Função para desenhar a chuva
function drawRain() {
  fill(0, 0, 255, 150); // Cor da chuva
  for (let i = 0; i < rainIntensity * 50; i++) {
    let x = random(width);
    let y = random(height - 150);
    ellipse(x, y, 5, 10); // Gotas de chuva
  }
}

// Função para mover o caminhão até a cidade
function moveTruckToCity() {
  if (truckX < width) {
    truckX += 3; // Velocidade do caminhão
  } else {
    // O caminhão coletou a planta, vai para a cidade
    plantCollected = true;  // Marca que a planta foi coletada
    truckX = -150; // Reseta a posição do caminhão
    plantHeight = 0; // Reseta a altura da planta
    growing = false; // Reseta o crescimento
    timePassed = 0; // Reseta o tempo
    weather = random(['sun', 'rain']); // Muda o clima aleatoriamente
  }

  // Desenhando o caminhão no campo
  fill(255, 0, 0); // Cor do caminhão
  rect(truckX, height - 150, 100, 50); // Corpo do caminhão
  fill(0); // Cor das rodas
  rect(truckX + 10, height - 120, 30, 30); // Roda 1
  rect(truckX + 60, height - 120, 30, 30); // Roda 2
}

// Função para desenhar a cidade
function drawCity() {
  background(200, 200, 255); // Cor do céu

  // Desenhando os prédios na cidade
  fill(150, 150, 150);
  rect(width - 250, height - 180, 200, 180); // Edifício 1
  rect(width - 500, height - 200, 150, 200); // Edifício 2

  // Texto da cidade
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Cidade", width - 150, 50);

  // Desenhando a planta na cidade no chão
  if (plantInCity) {
    fill(34, 139, 34); // Cor do tronco
    rect(width / 2 - plant.size / 2, height - 150 - plantMaxHeight, plant.size, plantMaxHeight); // Tronco

    fill(0, 255, 0); // Cor das folhas
    ellipse(width / 2, height - 150 - plantMaxHeight, plant.size * 1.5, plant.size * 1.5); // Folhas
  }

  // Após o caminhão chegar, ele começa a retornar para o campo
  if (truckX >= width - 150) {
    // O caminhão volta ao campo
    setTimeout(() => {
      plantInCity = false; // Planta desaparece na cidade
      plantHeight = 0; // Reseta a altura da planta
      growing = false; // Reseta o estado de crescimento
      timePassed = 0; // Reseta o tempo
      weather = random(['sun', 'rain']); // Muda o clima aleatoriamente
    }, 2000); // Espera 2 segundos para reiniciar o ciclo
  }
}