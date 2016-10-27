import { DTM } from "../shared/dtm";
import * as events from "events";
export module Game {
    export var currentRoundID = 0;
    var rounds: DTM.IRound[] = [];
    export var emitter = new events.EventEmitter();

    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var operators = [
        { name: "+", func: function (a: number, b: number) { return a + b; } },
        { name: "-", func: function (a: number, b: number) { return a - b; } },
        { name: "/", func: function (a: number, b: number) { return a / b; } },
        { name: "*", func: function (a: number, b: number) { return a * b; } }
    ];

    var defaultRoundTime = 20;
    var roundTime = defaultRoundTime; // current round time
    var roundInterval: NodeJS.Timer;
    export function startNewRound(): DTM.IEquation {
        currentRoundID++;
        stopRound();
        var equation = getRandomEquation(currentRoundID);

        var correctAnswer = equation.answer;
        if (Math.random() >= 0.5) // ~50% to override the correct awnser
        {
            var equation2 = getRandomEquation(0); // get fake awn
            equation.answer = equation2.answer;
        }


        var round: DTM.IRound = {
            id: currentRoundID,
            equation: equation,
            correctAnswer: correctAnswer,
            hasWinner: false
        }
        rounds.push(round);

        roundInterval = setInterval(() => {
            emitter.emit("nextRoundTime", roundTime--);
        }, 1000 * 1);
        return equation;
    }
    export function stopRound() {
        clearInterval(roundInterval);
        roundTime = defaultRoundTime;
    }
    export function getLastEquation(): DTM.IEquation {
        if (rounds.length > 0) {
            return rounds[rounds.length - 1].equation;
        } else {
            return startNewRound(); // start the game if no equations
        }
    }

    export function getPoint(answer: DTM.IAnswer): number {
        var lastRound = rounds[rounds.length - 1];
        var point = 0;
        if (lastRound) {
            if (!lastRound.hasWinner && lastRound.id === answer.roundID) { // in time answer
                if ((lastRound.correctAnswer === lastRound.equation.answer && answer.yes)
                    || (lastRound.correctAnswer !== lastRound.equation.answer && !answer.yes)) {
                    point = 1; // The first player to submit a correct answer gets 1 point for the round  
                    lastRound.hasWinner = true; // and completes the round.
                } else {
                    point = -1; // All incorrect answers subtract a point from the players' score. 
                }
            } else { // late answers
                var matchRound: DTM.IRound = null;
                rounds.forEach((round, i) => {
                    if (!matchRound && round.id) {
                        matchRound = round;
                    }
                });
                if (matchRound) {
                    if ((matchRound.correctAnswer === matchRound.equation.answer && answer.yes)
                        || (matchRound.correctAnswer !== matchRound.equation.answer && !answer.yes)) {
                        point = 0; // Correct late answers do not affect the score
                    } else {
                        point = -1; // All incorrect answers subtract a point from the players' score. 
                    }
                }

            }
        }
        return point;
    }

    function getRandomEquation(roundID: number): DTM.IEquation {
        var number1 = numbers[Math.floor(Math.random() * numbers.length)]; // random number in range
        var number2 = numbers[Math.floor(Math.random() * numbers.length)];  // random number 2 in range
        var operator = operators[Math.floor(Math.random() * operators.length)];  // random operator in range
        var operatorName = operator.name;
        var correctAnswer = operator.func(number1, number2);

        if (correctAnswer % 1 === 0) // is whole number
        {
            return {
                number1: number1,
                number2: number2,
                operator: operatorName,
                answer: correctAnswer,
                roundID: roundID,
                answered: false, // used on the client side
            }
        } else { // try again
            return getRandomEquation(roundID);
        }
    }

}


