const fs = require("node:fs");

/**
 * Find the greatest common divisor of two numbers
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */
const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)

/**
 * Find the least common multiple of two numbers
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */
const lcm = (a, b) =>  a / gcd (a, b) * b

/**
 * Find the least common multiple of an array of numbers
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */
const lcmAll = (numbers) => numbers.reduce (lcm, 1)

try {
  // const data = fs.readFileSync("testinput3.csv", "utf8");
  const data = fs.readFileSync("puzzleinput.csv", "utf8");
  const lines = data.split("\n");
  const instructions = lines[0].split("");
  const tree = {};
  const allNodes = [];
  for (let i = 2; i < lines.length; i++) {
    const input = lines[i].split(" = ");
    const node = input[0];
    const [left, right] = input[1].replace(/[\(\)\s]+/g, "").split(",");
    tree[node] = {
      L: left,
      R: right,
    };
    allNodes.push(node);
  }
  let nodes = allNodes.filter((node) => node.endsWith("A"));
  let size = nodes.length;

  // Now we find the minimum valid number of steps for each node to reach a node ending with Z and put them in an array
  let allSteps = [];
  for (let i = 0; i < size; i++) {
    let steps = 0;
    let node = nodes[i];
    while (!node.endsWith("Z")) {
      for (let instruction of instructions) {
        node = tree[node][instruction];
        steps++;
      }
    }
    allSteps.push(steps);
  }

  // Now we find the least common multiple of all the steps in the array
  console.log(lcmAll(allSteps));
} catch (err) {
  console.error(err);
}
