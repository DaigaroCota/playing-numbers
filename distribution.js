import * as regression from 'regression';
import * as math from 'mathjs';

const buildParametersForRegression = (amountNFTs, allocation, percentDiff) => {
    let base = allocation / amountNFTs;
    let diff = (percentDiff * base) / (2 + percentDiff);
    console.log('diff', diff);
    let zeroPoint = (1 + amountNFTs) / 2;
    let midPoint = amountNFTs * (3/4);
    return {
        0: [1, -diff],
        1: [zeroPoint, 0],
        2: [amountNFTs, diff]
    }
}

const transformPointsToFormat = points => {
    let dataArray = [];
    for (let index = 0; index < (Object.keys(points)).length; index++) {
        dataArray.push(
            [
                points[index][0], points[index][1]
            ]
        );
    }
    return dataArray;
}

const buildEquation = coefficients => {
    let equation = x => {
        return x*coefficients[0] + coefficients[1];
    }
    return equation;
}

const computeDistributionScheme = (amountNFTs, allocation, regressEq) => {
    let base = allocation / amountNFTs;
    let dist = [];
    for(let i = 1; i < amountNFTs+1; i++){
        console.log(i, regressEq(i));
        dist.push(base+regressEq(i));
    }
    return dist;
}

// Input Parameters
const amountOfNFTs = 10;
const allocationForNftTier = 1.25;
const percentageDelta = 0.3;

// Computations
const params = buildParametersForRegression(amountOfNFTs, allocationForNftTier, percentageDelta);
const data = transformPointsToFormat(params);
const regressionResult = regression.default.linear(data, {precision:10});
console.log(regressionResult);
const equation = buildEquation(regressionResult.equation);
const dist = computeDistributionScheme(
    amountOfNFTs,
    allocationForNftTier,
    equation
);
console.log(dist);
const sum = dist.reduce((prevVal, val) => {
    return prevVal+val;
}, 0);
const percentDiff = (dist[9] - dist[0]) / dist[0];
console.log('sumcheck: ', sum, 'Percentage Difference Check: %', percentDiff*100);

