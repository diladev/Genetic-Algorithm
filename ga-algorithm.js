// Genetic Algorithm parameters
const trainingData = require('./trainingData')
const inputData = require('./inputData')
const groundTruth = require('./groundTruth')

const populationSize = 50;
const chromosomeLength = 10;
const mutationRate = 0.1;


function evaluateFitness(chromosome) {
  const neuralNetwork = createNeuralNetwork(chromosome);
  trainNeuralNetwork(neuralNetwork, trainingData); 
  const predictions = makePredictions(neuralNetwork);
  const fitness = calculateFitness(predictions);
  return fitness;
}


class NeuralNetwork {
  constructor() {
    this.weights = [];
  }

  setWeights(weights) {
    this.weights = weights;
  }

  train(trainingData) {
    for (const example of trainingData) {
      const input = example.input;
      const output = example.output;
    }
  }

  predict(inputData) {
    const predictions = [];
    for (const input of inputData) {
      const prediction = this.calculatePrediction(input);
      predictions.push(prediction);
    }
    return predictions;
  }

  calculatePrediction(input) {
    const weightedSum = this.calculateWeightedSum(input);
    const activation = this.applyActivationFunction(weightedSum);
    const prediction = Math.round(activation);
    return prediction;
  }

  calculateWeightedSum(input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * this.weights[i];
    }
    return sum;
  }

  applyActivationFunction(weightedSum) {
    return weightedSum;
  }
}

function createNeuralNetwork(weights) {
  const neuralNetwork = new NeuralNetwork();
  neuralNetwork.setWeights(weights);
  return neuralNetwork;
}

function trainNeuralNetwork(neuralNetwork, trainingData) {
  neuralNetwork.train(trainingData);
}

function makePredictions(neuralNetwork) {
  const predictions = neuralNetwork.predict(inputData);
  return predictions;
}

function calculateFitness(predictions) {
  const fitness = calculateAccuracy(predictions, groundTruth);
  return fitness;
}

function calculateAccuracy(predictions, groundTruth) {
  let correctCount = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === groundTruth[i]) {
      correctCount++;
    }
  }
  const accuracy = correctCount / predictions.length;
  return accuracy;
}

const population = [];
for (let i = 0; i < populationSize; i++) {
  const chromosome = Array.from({ length: chromosomeLength }, () =>
    getRandomNumber(-1, 1)
  );
  population.push(chromosome);
}

const generations = 10;
for (let generation = 0; generation < generations; generation++) {
  const fitnessScores = population.map((chromosome) =>
    evaluateFitness(chromosome)
  );

  const selectedParents = [];
  const totalFitness = fitnessScores.reduce((a, b) => a + b, 0);
  for (let i = 0; i < populationSize; i++) {
    const r = getRandomNumber(0, totalFitness);
    let cumulativeFitness = 0;
    for (let j = 0; j < fitnessScores.length; j++) {
      cumulativeFitness += fitnessScores[j];
      if (cumulativeFitness >= r) {
        selectedParents.push(population[j]);
        break;
      }
    }
  }

  const offspring = [];
  for (let i = 0; i < populationSize; i += 2) {
    const parent1 = selectedParents[i];
    const parent2 = selectedParents[i + 1];
    const child1 = [];
    const child2 = [];
    for (let j = 0; j < chromosomeLength; j++) {
      if (getRandomBoolean()) {
        child1.push(parent1[j]);
        child2.push(parent2[j]);
      } else {
        child1.push(parent2[j]);
        child2.push(parent1[j]);
      }
    }
    offspring.push(child1, child2);
  }

  for (let i = 0; i < populationSize; i++) {
    for (let j = 0; j < chromosomeLength; j++) {
      if (getRandomFloat() < mutationRate) {
        offspring[i][j] = getRandomNumber(-1, 1);
      }
    }
  }

  population.splice(0, populationSize, ...offspring);
}

let bestChromosome;
let bestFitness = -Infinity;
for (const chromosome of population) {
  const fitness = evaluateFitness(chromosome);
  if (fitness > bestFitness) {
    bestChromosome = chromosome;
    bestFitness = fitness;
  }
}

console.log('Best Solution:');
console.log(JSON.stringify({ Weights: bestChromosome.map(weight => weight.toFixed(10)), 'Fitness (Accuracy)': bestFitness.toFixed(2) }, null, 2));

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomFloat() {
  return Math.random();
}
