let country = "Italy";
let continent = "Europe";
let population = 60000000;

console.log(country);
console.log(continent);
console.log(population);

const isIsland = false;
const LANGUAGE = "Italian";

console.log(isIsland, population, country, LANGUAGE);

let newPopulation = population / 2;

console.log(newPopulation, newPopulation + 1);

let averagePopulation = 33000000;

console.log(population > averagePopulation);

let description = country + " is in " + continent + ", and its " + population + " people speak " + LANGUAGE;

console.log(description);
 
if (population > averagePopulation) {
    console.log("The population is above average by " + (population - averagePopulation));
} else {
    console.log("The population is below average by " + (population - averagePopulation));
}



